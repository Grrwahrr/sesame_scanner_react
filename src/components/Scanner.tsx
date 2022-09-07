import React, {FC, useEffect, useRef, useState} from "react";
import {
    base58ToPubKey,
    deriveTicket,
    getKeyPairForSecretKeyBase58,
    getKeyPairForTicket,
    notifyTxError, notifyTxSuccess, ticketCheckIn,
    ticketProgram
} from "../utils/solana";
import {Keypair} from "@solana/web3.js";


const CANVAS_X = 500;
const CANVAS_Y = 375;
const CAMERA_FPS = 5;
const SAMPLE_RATE = 500;
const CONFIG_KEY = "eventConfig";

type EventConfig = {
    name: string,
    event: string,
    wallet: Keypair,
};

enum CheckInState {
    Pending = 1,
    PendingTicketUpdate,
    Success,
    Error,
}

type TicketDisplay = {
    name: string,
    seatName: string,
    state: CheckInState,
    error: string,
};

type QrTicket = {
    name: string,
    ticketOffset: number,
    seatName: string,
    seed: string,
    event: string,
};


export const Scanner: FC = () => {
    const video = useRef<HTMLVideoElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);

    const [scannerActive, setScannerActive] = useState<boolean>(false);
    const [ticketDisplay, setTicketDisplay] = useState<TicketDisplay | undefined>(undefined);
    const [eventConfig, setEventConfig] = useState<EventConfig | undefined>(undefined);
    const [qrWorker, setQrWorker] = useState<Worker | undefined>(undefined);
    const [tickCount, setTickCount] = useState<number>(0);
    const [verifyQrTicket, setVerifyQrTicket] = useState<QrTicket | undefined>(undefined);

    // Setup once
    useEffect(() => {
        console.log("Initialize...");

        // Init worker
        initWorker();

        // Setup processor
        const interval = setInterval(() => setTickCount(prev => prev + 1), SAMPLE_RATE);

        // Try to restore config from local storage
        if (typeof window !== 'undefined') {
            const localConfig = JSON.parse(localStorage.getItem(CONFIG_KEY));
            if (localConfig) {
                setEventConfig(localConfig);
            }
        }

        return () => {
            console.log(`Clean up...`);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!verifyQrTicket) {
            return;
        }

        // Attempt to verify & check in
        ticketVerifyAndCheckIn(verifyQrTicket).then(
            () => console.log("verifyQrTicket: COMPLETE")
        );

    }, [verifyQrTicket]);


    useEffect(() => {
        processCameraFeed();
    }, [tickCount]);


    const initWorker = () => {
        const worker = new Worker("wasmWorker.js");

        worker.onmessage = async event => {
            if (event.data === null) {
                return;
            }

            // Decode qr code data
            let json = Buffer.from(event.data.data, "base64").toString();
            let qrData = JSON.parse(json);

            // Check if this is a ticket
            if (qrData.ns !== undefined && qrData.to !== undefined && qrData.se !== undefined && qrData.ev !== undefined) {
                // Discontinue parsing
                stopScan();
                // qrWorker.terminate();

                let qrTicket: QrTicket = {
                    name: qrData.ns,
                    ticketOffset: qrData.to,
                    seatName: qrData.sn,
                    seed: qrData.se,
                    event: qrData.ev
                };

                // DEBUG
                console.log("WORKER CALLED BACK WITH TICKET: ", qrTicket);

                // Attempt to verify & check in
                setVerifyQrTicket(prev => {
                    return prev ? prev : qrTicket
                });
            }

            // Check if this is a config
            if (qrData.na !== undefined && qrData.sc !== undefined && qrData.ev !== undefined) {
                // Discontinue parsing
                stopScan();

                // Store config in local storage & state
                const wallet = getKeyPairForSecretKeyBase58(qrData.sc);
                if (wallet) {
                    const config = {name: qrData.na, event: qrData.ev, wallet: wallet};
                    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
                    setEventConfig(config);
                    notifyTxSuccess("The config has been updated.", "");
                } else {
                    notifyTxError("The wallet configuration is not valid.", "", "");
                }

                // DEBUG
                console.log("WORKER CALLED BACK WITH CONFIG; WALLET CONFIGURED!");
            }
        };

        // Store worker
        setQrWorker(worker);
    };

    const testDelay = (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    const ticketVerifyAndCheckIn = async (qrTicket: QrTicket) => {
        console.log("ticketVerifyAndCheckIn BEGIN...");

        // Check if the config is set
        if (!eventConfig) {
            notifyTxError("No event is configured! Scan event QR first.", "", "");
            return;
        }

        if (!eventConfig.wallet) {
            notifyTxError("The event configuration has a bad wallet.", "", "");
            return;
        }

        // Check if the config event matches that of the ticket
        if (eventConfig.event !== qrTicket.event) {
            notifyTxError("The ticket is for another event.", "", "");
            return;
        }

        // Set display data
        setTicketDisplay({name: qrTicket.name, seatName: qrTicket.seatName, state: CheckInState.Pending, error: ""});

        // Set up the ticket program
        const program = ticketProgram(eventConfig.wallet);

        // Generate the attendees paper wallet
        const attendee = getKeyPairForTicket(qrTicket.name, qrTicket.seatName, qrTicket.seed, qrTicket.event);

        // Find the ticket account
        const [accTicket, bumpTicket] = deriveTicket(program, base58ToPubKey(eventConfig.event), qrTicket.ticketOffset);

        // Load the ticket account
        let ticket = undefined;
        try {
            ticket = await program.account.ticket.fetch(accTicket);
        } catch (error: any) {
        }

        // Check various error conditions
        let errorText = undefined;

        // Account can not be missing
        if (ticket === undefined) {
            errorText = "Ticket does not exist!";
        }

        // Ticket state is invalid
        if (ticket && ticket.state > 0) {
            errorText = "Ticket already checked in!";
        }

        // Ticket owner must match expected
        if (!errorText && ticket && ticket.owner !== attendee.publicKey) {
            errorText = "Ticket data is invalid!";
        }

        // Any errors?
        if (errorText) {
            setTicketDisplay(prev => {
                return {...prev, state: CheckInState.Error}
            });
            notifyTxError(errorText, "", "");
            return;
        }

        // Update visuals
        setTicketDisplay(prev => {
            return {...prev, state: CheckInState.PendingTicketUpdate}
        });

        // Attempt to update the tickets state
        const res = await ticketCheckIn(program, qrTicket.ticketOffset, eventConfig.wallet, attendee, base58ToPubKey(eventConfig.event), accTicket);

        if (!res.success) {
            setTicketDisplay(prev => {
                return {...prev, state: CheckInState.Error}
            });
            notifyTxError(res.error.message, res.error, "");
            return;
        }

        // Check successful execution
        //TODO at what point is this successful?

        // Assume everything checked out
        await testDelay(3001);
        setTicketDisplay(prev => {
            return {...prev, state: CheckInState.Success}
        });
    };

    const startScan = () => {
        setScannerActive(true);

        // Already set up?
        if (video.current.srcObject) {
            video.current.play();
            return;
        }

        // Request camera stream & bind to video element
        navigator.mediaDevices.getUserMedia({
            audio: false, video: {
                frameRate: CAMERA_FPS,
                height: CANVAS_Y,
                width: CANVAS_X,
                facingMode: "environment"
            }
        }).then(stream => {
            video.current.srcObject = stream;
            video.current.setAttribute("playsinline", "true");
            video.current.play();
        }).catch(err => {
            stopScan();
            alert(err);
        });
    };


    const stopScan = () => {
        //TODO: make this paused only - so we can resume quickly
        setScannerActive(false);
        video.current.pause();
        // if (video.current.srcObject) {
        //     video.current.srcObject.getVideoTracks().forEach(track => track.stop());
        //     video.current.srcObject = null;
        // }
    };

    const processCameraFeed = () => {
        if (scannerActive && video.current.readyState === video.current.HAVE_ENOUGH_DATA) {
            console.log("TICK DOING");

            let draw2d = canvas.current.getContext("2d");
            draw2d.drawImage(video.current, 0, 0, CANVAS_X, CANVAS_Y, 0, 0, CANVAS_X, CANVAS_Y);

            let imgd = draw2d.getImageData(0, 0, canvas.current.width, canvas.current.height);
            let pix = imgd.data;
            for (let i = 0; i < pix.length; i += 4) {
                let gray = pix[i] * 0.3 + pix[i + 1] * 0.59 + pix[i + 2] * 0.11;
                pix[i] = gray;
                pix[i + 1] = gray;
                pix[i + 2] = gray;
            }

            // Update canvas
            draw2d.putImageData(imgd, 0, 0);

            if (qrWorker === undefined) {
                console.log("QRWorker is not set!", qrWorker);
                return;
            }

            // Get image data and send to qr processor
            let imageData = draw2d.getImageData(0, 0, canvas.current.width, canvas.current.height);
            qrWorker.postMessage({width: imageData.width, height: imageData.height});
            qrWorker.postMessage(imageData, [imageData.data.buffer]);
        } else {
            console.log("TICK IDLE");
        }
    };


    const onBtnClickHandler = (e) => {
        e.preventDefault();
        if (scannerActive) stopScan(); else startScan();
    };

    const renderButtons = () => {
        let label = "Start Scanner";

        if (scannerActive) {
            label = "Stop Scanner";
        }

        if (ticketDisplay !== undefined && (ticketDisplay.state === CheckInState.Pending || ticketDisplay.state === CheckInState.PendingTicketUpdate)) {
            return <button disabled={true} className="loading btn btn-outline btn-sm btn-secondary"></button>;
        }

        return <button className="btn btn-sm btn-secondary" onClick={onBtnClickHandler}><span>{label}</span></button>;
    };

    const renderTicketInfo = () => {
        if (ticketDisplay !== undefined) {
            let cardClass = "card w-full bg-primary text-primary-content";

            if (ticketDisplay.state === CheckInState.Success) {
                cardClass = "card w-full bg-success text-success-content";
            }
            if (ticketDisplay.state === CheckInState.Error) {
                cardClass = "card w-full bg-error text-error-content";
            }

            return <div className="w-full px-5 pt-5">
                <div className={cardClass}>
                    <div className="card-body items-center text-center">
                        <h2 className="card-title">Ticket</h2>
                        <p>{ticketDisplay.name}</p>
                        <p>{ticketDisplay.seatName}</p>
                    </div>
                </div>
            </div>
        }

        return <></>
    }

    const renderFooter = () => {

        let snipTicketData = <></>;

        if (ticketDisplay !== undefined && ticketDisplay.state === CheckInState.Pending) {
            snipTicketData = <button className="btn loading btn-primary my-1">Verifying Ticket</button>;
        }
        if (ticketDisplay !== undefined && ticketDisplay.state === CheckInState.PendingTicketUpdate) {
            snipTicketData = <button className="btn loading btn-primary my-1">Check In Pending</button>;
        }
        if (ticketDisplay !== undefined && ticketDisplay.state === CheckInState.Success) {
            snipTicketData = <button className="btn btn-success my-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeWidth="2" d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                </svg>
                Success
            </button>;
        }
        if (ticketDisplay !== undefined && ticketDisplay.state === CheckInState.Error) {
            snipTicketData = <button className="btn btn-error my-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Error
            </button>;
        }

        return <footer className="footer footer-center bg-base-300 text-base-content absolute bottom-0">
            <div className="w-full">
                {snipTicketData}
                {eventConfig === undefined ?
                    <p className="w-full p-2 border-t-2 border-solid border-cyan-700">This app has not been set up for
                        an event. Please scan a QR code with the configuration.</p> :
                    <p className="w-full p-2 border-t-2 border-solid border-cyan-700">{eventConfig.name}</p>
                }
            </div>
        </footer>
    };

    return <div
        className={"w-full text-center min-h-screen " + (eventConfig !== undefined ? "bg-neutral text-neutral-content" : "bg-warning text-neutral-content")}>
        <video ref={video} hidden></video>
        <canvas className="m-[auto] pb-5 max-w-full" ref={canvas} width={CANVAS_X} height={CANVAS_Y}></canvas>
        <div className="">
            {renderButtons()}
        </div>
        {renderTicketInfo()}
        {renderFooter()}
    </div>
}

/**
 * TODO
 *          Figure how koder packages this into a WASM app
 *
 *          PROBABLY need the user to press some back button
 *              MAKE it resume faster
 *              currently it shuts the camera off - would be better to keep it on - just pause or so
 */
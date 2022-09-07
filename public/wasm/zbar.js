var CreateKoder = (() => {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
        function (CreateKoder) {
            CreateKoder = CreateKoder || {};


            var d;
            d || (d = typeof CreateKoder !== 'undefined' ? CreateKoder : {});
            var aa = Object.assign, ba, n;
            d.ready = new Promise(function (a, b) {
                ba = a;
                n = b
            });
            var ca = aa({}, d), u = [], v = "./this.program", w = (a, b) => {
                    throw b;
                }, da = "object" === typeof window, x = "function" === typeof importScripts,
                ea = "object" === typeof process && "object" === typeof process.versions && "string" === typeof process.versions.node,
                y = "", A, B, C, fs, D, F;
            if (ea) y = x ? require("path").dirname(y) + "/" : __dirname + "/", F = function () {
                D || (fs = require("fs"), D = require("path"))
            }, A = function (a, b) {
                F();
                a = D.normalize(a);
                return fs.readFileSync(a, b ? null : "utf8")
            }, C = function (a) {
                a = A(a, !0);
                a.buffer || (a = new Uint8Array(a));
                return a
            }, B = function (a, b, e) {
                F();
                a = D.normalize(a);
                fs.readFile(a, function (f, h) {
                    f ? e(f) : b(h.buffer)
                })
            }, 1 < process.argv.length && (v = process.argv[1].replace(/\\/g, "/")), u = process.argv.slice(2), process.on("uncaughtException", function (a) {
                if (!(a instanceof G)) throw a;
            }),
                process.on("unhandledRejection", function (a) {
                    throw a;
                }), w = (a, b) => {
                if (noExitRuntime || 0 < fa) throw process.exitCode = a, b;
                b instanceof G || H("exiting due to exception: " + b);
                process.exit(a)
            }, d.inspect = function () {
                return "[Emscripten Module object]"
            }; else if (da || x) x ? y = self.location.href : "undefined" !== typeof document && document.currentScript && (y = document.currentScript.src), _scriptDir && (y = _scriptDir), 0 !== y.indexOf("blob:") ? y = y.substr(0, y.replace(/[?#].*/, "").lastIndexOf("/") + 1) : y = "", A = function (a) {
                var b = new XMLHttpRequest;
                b.open("GET", a, !1);
                b.send(null);
                return b.responseText
            }, x && (C = function (a) {
                var b = new XMLHttpRequest;
                b.open("GET", a, !1);
                b.responseType = "arraybuffer";
                b.send(null);
                return new Uint8Array(b.response)
            }), B = function (a, b, e) {
                var f = new XMLHttpRequest;
                f.open("GET", a, !0);
                f.responseType = "arraybuffer";
                f.onload = function () {
                    200 == f.status || 0 == f.status && f.response ? b(f.response) : e()
                };
                f.onerror = e;
                f.send(null)
            };
            var ha = d.print || console.log.bind(console), H = d.printErr || console.warn.bind(console);
            aa(d, ca);
            ca = null;
            d.arguments && (u = d.arguments);
            d.thisProgram && (v = d.thisProgram);
            d.quit && (w = d.quit);
            var I;
            d.wasmBinary && (I = d.wasmBinary);
            var noExitRuntime = d.noExitRuntime || !0;
            "object" !== typeof WebAssembly && J("no native wasm support detected");
            var K, L = !1;

            function ia(a, b, e, f) {
                var h = {
                    string: function (l) {
                        var p = 0;
                        if (null !== l && void 0 !== l && 0 !== l) {
                            var E = (l.length << 2) + 1;
                            p = M(E);
                            ja(l, N, p, E)
                        }
                        return p
                    }, array: function (l) {
                        var p = M(l.length);
                        O.set(l, p);
                        return p
                    }
                };
                a = d["_" + a];
                var g = [], m = 0;
                if (f) for (var r = 0; r < f.length; r++) {
                    var t = h[e[r]];
                    t ? (0 === m && (m = ka()), g[r] = t(f[r])) : g[r] = f[r]
                }
                e = a.apply(null, g);
                return e = function (l) {
                    0 !== m && la(m);
                    return "string" === b ? P(l) : "boolean" === b ? !!l : l
                }(e)
            }

            var ma = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0;

            function na(a, b, e) {
                var f = b + e;
                for (e = b; a[e] && !(e >= f);) ++e;
                if (16 < e - b && a.subarray && ma) return ma.decode(a.subarray(b, e));
                for (f = ""; b < e;) {
                    var h = a[b++];
                    if (h & 128) {
                        var g = a[b++] & 63;
                        if (192 == (h & 224)) f += String.fromCharCode((h & 31) << 6 | g); else {
                            var m = a[b++] & 63;
                            h = 224 == (h & 240) ? (h & 15) << 12 | g << 6 | m : (h & 7) << 18 | g << 12 | m << 6 | a[b++] & 63;
                            65536 > h ? f += String.fromCharCode(h) : (h -= 65536, f += String.fromCharCode(55296 | h >> 10, 56320 | h & 1023))
                        }
                    } else f += String.fromCharCode(h)
                }
                return f
            }

            function P(a, b) {
                return a ? na(N, a, b) : ""
            }

            function ja(a, b, e, f) {
                if (0 < f) {
                    f = e + f - 1;
                    for (var h = 0; h < a.length; ++h) {
                        var g = a.charCodeAt(h);
                        if (55296 <= g && 57343 >= g) {
                            var m = a.charCodeAt(++h);
                            g = 65536 + ((g & 1023) << 10) | m & 1023
                        }
                        if (127 >= g) {
                            if (e >= f) break;
                            b[e++] = g
                        } else {
                            if (2047 >= g) {
                                if (e + 1 >= f) break;
                                b[e++] = 192 | g >> 6
                            } else {
                                if (65535 >= g) {
                                    if (e + 2 >= f) break;
                                    b[e++] = 224 | g >> 12
                                } else {
                                    if (e + 3 >= f) break;
                                    b[e++] = 240 | g >> 18;
                                    b[e++] = 128 | g >> 12 & 63
                                }
                                b[e++] = 128 | g >> 6 & 63
                            }
                            b[e++] = 128 | g & 63
                        }
                    }
                    b[e] = 0
                }
            }

            function oa(a) {
                for (var b = 0, e = 0; e < a.length; ++e) {
                    var f = a.charCodeAt(e);
                    55296 <= f && 57343 >= f && (f = 65536 + ((f & 1023) << 10) | a.charCodeAt(++e) & 1023);
                    127 >= f ? ++b : b = 2047 >= f ? b + 2 : 65535 >= f ? b + 3 : b + 4
                }
                return b
            }

            function pa(a) {
                var b = oa(a) + 1, e = M(b);
                ja(a, O, e, b);
                return e
            }

            var qa, O, N, Q;

            function ra() {
                var a = K.buffer;
                qa = a;
                d.HEAP8 = O = new Int8Array(a);
                d.HEAP16 = new Int16Array(a);
                d.HEAP32 = Q = new Int32Array(a);
                d.HEAPU8 = N = new Uint8Array(a);
                d.HEAPU16 = new Uint16Array(a);
                d.HEAPU32 = new Uint32Array(a);
                d.HEAPF32 = new Float32Array(a);
                d.HEAPF64 = new Float64Array(a)
            }

            var sa, ta = [], ua = [], va = [], wa = [], fa = 0;

            function xa() {
                var a = d.preRun.shift();
                ta.unshift(a)
            }

            var R = 0, ya = null, S = null;
            d.preloadedImages = {};
            d.preloadedAudios = {};

            function J(a) {
                if (d.onAbort) d.onAbort(a);
                a = "Aborted(" + a + ")";
                H(a);
                L = !0;
                a = new WebAssembly.RuntimeError(a + ". Build with -s ASSERTIONS=1 for more info.");
                n(a);
                throw a;
            }

            function za() {
                return T.startsWith("data:application/octet-stream;base64,")
            }

            var T;
            T = "zbar.wasm";
            if (!za()) {
                var Aa = T;
                T = d.locateFile ? d.locateFile(Aa, y) : y + Aa
            }

            function Ba() {
                var a = T;
                try {
                    if (a == T && I) return new Uint8Array(I);
                    if (C) return C(a);
                    throw"both async and sync fetching of the wasm failed";
                } catch (b) {
                    J(b)
                }
            }

            function Ca() {
                if (!I && (da || x)) {
                    if ("function" === typeof fetch && !T.startsWith("file://")) return fetch(T, {credentials: "same-origin"}).then(function (a) {
                        if (!a.ok) throw"failed to load wasm binary file at '" + T + "'";
                        return a.arrayBuffer()
                    }).catch(function () {
                        return Ba()
                    });
                    if (B) return new Promise(function (a, b) {
                        B(T, function (e) {
                            a(new Uint8Array(e))
                        }, b)
                    })
                }
                return Promise.resolve().then(function () {
                    return Ba()
                })
            }

            function U(a) {
                for (; 0 < a.length;) {
                    var b = a.shift();
                    if ("function" == typeof b) b(d); else {
                        var e = b.N;
                        "number" === typeof e ? void 0 === b.H ? sa.get(e)() : sa.get(e)(b.H) : e(void 0 === b.H ? null : b.H)
                    }
                }
            }

            var Da;
            Da = ea ? () => {
                var a = process.hrtime();
                return 1E3 * a[0] + a[1] / 1E6
            } : () => performance.now();
            var Ea = {};

            function Ha() {
                if (!Ia) {
                    var a = {
                        USER: "web_user",
                        LOGNAME: "web_user",
                        PATH: "/",
                        PWD: "/",
                        HOME: "/home/web_user",
                        LANG: ("object" === typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
                        _: v || "./this.program"
                    }, b;
                    for (b in Ea) void 0 === Ea[b] ? delete a[b] : a[b] = Ea[b];
                    var e = [];
                    for (b in a) e.push(b + "=" + a[b]);
                    Ia = e
                }
                return Ia
            }

            var Ia, Ja = [null, [], []], Ka = {};

            function V(a) {
                return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400)
            }

            function La(a, b) {
                for (var e = 0, f = 0; f <= b; e += a[f++]) ;
                return e
            }

            var W = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                X = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            function Y(a, b) {
                for (a = new Date(a.getTime()); 0 < b;) {
                    var e = a.getMonth(), f = (V(a.getFullYear()) ? W : X)[e];
                    if (b > f - a.getDate()) b -= f - a.getDate() + 1, a.setDate(1), 11 > e ? a.setMonth(e + 1) : (a.setMonth(0), a.setFullYear(a.getFullYear() + 1)); else {
                        a.setDate(a.getDate() + b);
                        break
                    }
                }
                return a
            }

            function Ma(a, b, e, f) {
                function h(c, k, q) {
                    for (c = "number" === typeof c ? c.toString() : c || ""; c.length < k;) c = q[0] + c;
                    return c
                }

                function g(c, k) {
                    return h(c, k, "0")
                }

                function m(c, k) {
                    function q(Fa) {
                        return 0 > Fa ? -1 : 0 < Fa ? 1 : 0
                    }

                    var z;
                    0 === (z = q(c.getFullYear() - k.getFullYear())) && 0 === (z = q(c.getMonth() - k.getMonth())) && (z = q(c.getDate() - k.getDate()));
                    return z
                }

                function r(c) {
                    switch (c.getDay()) {
                        case 0:
                            return new Date(c.getFullYear() - 1, 11, 29);
                        case 1:
                            return c;
                        case 2:
                            return new Date(c.getFullYear(), 0, 3);
                        case 3:
                            return new Date(c.getFullYear(),
                                0, 2);
                        case 4:
                            return new Date(c.getFullYear(), 0, 1);
                        case 5:
                            return new Date(c.getFullYear() - 1, 11, 31);
                        case 6:
                            return new Date(c.getFullYear() - 1, 11, 30)
                    }
                }

                function t(c) {
                    c = Y(new Date(c.A + 1900, 0, 1), c.G);
                    var k = new Date(c.getFullYear() + 1, 0, 4), q = r(new Date(c.getFullYear(), 0, 4));
                    k = r(k);
                    return 0 >= m(q, c) ? 0 >= m(k, c) ? c.getFullYear() + 1 : c.getFullYear() : c.getFullYear() - 1
                }

                var l = Q[f + 40 >> 2];
                f = {
                    K: Q[f >> 2],
                    J: Q[f + 4 >> 2],
                    D: Q[f + 8 >> 2],
                    C: Q[f + 12 >> 2],
                    B: Q[f + 16 >> 2],
                    A: Q[f + 20 >> 2],
                    F: Q[f + 24 >> 2],
                    G: Q[f + 28 >> 2],
                    P: Q[f + 32 >> 2],
                    I: Q[f + 36 >> 2],
                    L: l ? P(l) :
                        ""
                };
                e = P(e);
                l = {
                    "%c": "%a %b %d %H:%M:%S %Y",
                    "%D": "%m/%d/%y",
                    "%F": "%Y-%m-%d",
                    "%h": "%b",
                    "%r": "%I:%M:%S %p",
                    "%R": "%H:%M",
                    "%T": "%H:%M:%S",
                    "%x": "%m/%d/%y",
                    "%X": "%H:%M:%S",
                    "%Ec": "%c",
                    "%EC": "%C",
                    "%Ex": "%m/%d/%y",
                    "%EX": "%H:%M:%S",
                    "%Ey": "%y",
                    "%EY": "%Y",
                    "%Od": "%d",
                    "%Oe": "%e",
                    "%OH": "%H",
                    "%OI": "%I",
                    "%Om": "%m",
                    "%OM": "%M",
                    "%OS": "%S",
                    "%Ou": "%u",
                    "%OU": "%U",
                    "%OV": "%V",
                    "%Ow": "%w",
                    "%OW": "%W",
                    "%Oy": "%y"
                };
                for (var p in l) e = e.replace(new RegExp(p, "g"), l[p]);
                var E = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                    Ga = "January February March April May June July August September October November December".split(" ");
                l = {
                    "%a": function (c) {
                        return E[c.F].substring(0, 3)
                    }, "%A": function (c) {
                        return E[c.F]
                    }, "%b": function (c) {
                        return Ga[c.B].substring(0, 3)
                    }, "%B": function (c) {
                        return Ga[c.B]
                    }, "%C": function (c) {
                        return g((c.A + 1900) / 100 | 0, 2)
                    }, "%d": function (c) {
                        return g(c.C, 2)
                    }, "%e": function (c) {
                        return h(c.C, 2, " ")
                    }, "%g": function (c) {
                        return t(c).toString().substring(2)
                    }, "%G": function (c) {
                        return t(c)
                    }, "%H": function (c) {
                        return g(c.D, 2)
                    },
                    "%I": function (c) {
                        c = c.D;
                        0 == c ? c = 12 : 12 < c && (c -= 12);
                        return g(c, 2)
                    }, "%j": function (c) {
                        return g(c.C + La(V(c.A + 1900) ? W : X, c.B - 1), 3)
                    }, "%m": function (c) {
                        return g(c.B + 1, 2)
                    }, "%M": function (c) {
                        return g(c.J, 2)
                    }, "%n": function () {
                        return "\n"
                    }, "%p": function (c) {
                        return 0 <= c.D && 12 > c.D ? "AM" : "PM"
                    }, "%S": function (c) {
                        return g(c.K, 2)
                    }, "%t": function () {
                        return "\t"
                    }, "%u": function (c) {
                        return c.F || 7
                    }, "%U": function (c) {
                        var k = new Date(c.A + 1900, 0, 1), q = 0 === k.getDay() ? k : Y(k, 7 - k.getDay());
                        c = new Date(c.A + 1900, c.B, c.C);
                        return 0 > m(q, c) ? g(Math.ceil((31 -
                            q.getDate() + (La(V(c.getFullYear()) ? W : X, c.getMonth() - 1) - 31) + c.getDate()) / 7), 2) : 0 === m(q, k) ? "01" : "00"
                    }, "%V": function (c) {
                        var k = new Date(c.A + 1901, 0, 4), q = r(new Date(c.A + 1900, 0, 4));
                        k = r(k);
                        var z = Y(new Date(c.A + 1900, 0, 1), c.G);
                        return 0 > m(z, q) ? "53" : 0 >= m(k, z) ? "01" : g(Math.ceil((q.getFullYear() < c.A + 1900 ? c.G + 32 - q.getDate() : c.G + 1 - q.getDate()) / 7), 2)
                    }, "%w": function (c) {
                        return c.F
                    }, "%W": function (c) {
                        var k = new Date(c.A, 0, 1),
                            q = 1 === k.getDay() ? k : Y(k, 0 === k.getDay() ? 1 : 7 - k.getDay() + 1);
                        c = new Date(c.A + 1900, c.B, c.C);
                        return 0 > m(q,
                            c) ? g(Math.ceil((31 - q.getDate() + (La(V(c.getFullYear()) ? W : X, c.getMonth() - 1) - 31) + c.getDate()) / 7), 2) : 0 === m(q, k) ? "01" : "00"
                    }, "%y": function (c) {
                        return (c.A + 1900).toString().substring(2)
                    }, "%Y": function (c) {
                        return c.A + 1900
                    }, "%z": function (c) {
                        c = c.I;
                        var k = 0 <= c;
                        c = Math.abs(c) / 60;
                        return (k ? "+" : "-") + String("0000" + (c / 60 * 100 + c % 60)).slice(-4)
                    }, "%Z": function (c) {
                        return c.L
                    }, "%%": function () {
                        return "%"
                    }
                };
                for (p in l) e.includes(p) && (e = e.replace(new RegExp(p, "g"), l[p](f)));
                p = Na(e);
                if (p.length > b) return 0;
                O.set(p, a);
                return p.length -
                    1
            }

            function Na(a) {
                var b = Array(oa(a) + 1);
                ja(a, b, 0, b.length);
                return b
            }

            var Pa = {
                k: function (a, b, e, f) {
                    J("Assertion failed: " + P(a) + ", at: " + [b ? P(b) : "unknown filename", e, f ? P(f) : "unknown function"])
                }, a: function () {
                    J("")
                }, j: function (a, b) {
                    if (0 === a) a = Date.now(); else if (1 === a || 4 === a) a = Da(); else return Q[Oa() >> 2] = 28, -1;
                    Q[b >> 2] = a / 1E3 | 0;
                    Q[b + 4 >> 2] = a % 1E3 * 1E6 | 0;
                    return 0
                }, c: function (a) {
                    var b = N.length;
                    a >>>= 0;
                    if (2147483648 < a) return !1;
                    for (var e = 1; 4 >= e; e *= 2) {
                        var f = b * (1 + .2 / e);
                        f = Math.min(f, a + 100663296);
                        f = Math.max(a, f);
                        0 < f % 65536 && (f += 65536 - f % 65536);
                        a:{
                            try {
                                K.grow(Math.min(2147483648, f) - qa.byteLength +
                                    65535 >>> 16);
                                ra();
                                var h = 1;
                                break a
                            } catch (g) {
                            }
                            h = void 0
                        }
                        if (h) return !0
                    }
                    return !1
                }, e: function (a, b) {
                    var e = 0;
                    Ha().forEach(function (f, h) {
                        var g = b + e;
                        h = Q[a + 4 * h >> 2] = g;
                        for (g = 0; g < f.length; ++g) O[h++ >> 0] = f.charCodeAt(g);
                        O[h >> 0] = 0;
                        e += f.length + 1
                    });
                    return 0
                }, f: function (a, b) {
                    var e = Ha();
                    Q[a >> 2] = e.length;
                    var f = 0;
                    e.forEach(function (h) {
                        f += h.length + 1
                    });
                    Q[b >> 2] = f;
                    return 0
                }, h: function () {
                    return 0
                }, g: function (a, b, e, f) {
                    a = Ka.O(a);
                    b = Ka.M(a, b, e);
                    Q[f >> 2] = b;
                    return 0
                }, i: function () {
                }, b: function (a, b, e, f) {
                    for (var h = 0, g = 0; g < e; g++) {
                        var m =
                            Q[b >> 2], r = Q[b + 4 >> 2];
                        b += 8;
                        for (var t = 0; t < r; t++) {
                            var l = N[m + t], p = Ja[a];
                            0 === l || 10 === l ? ((1 === a ? ha : H)(na(p, 0)), p.length = 0) : p.push(l)
                        }
                        h += r
                    }
                    Q[f >> 2] = h;
                    return 0
                }, d: function (a, b, e, f) {
                    return Ma(a, b, e, f)
                }
            };
            (function () {
                function a(h) {
                    d.asm = h.exports;
                    K = d.asm.l;
                    ra();
                    sa = d.asm.s;
                    ua.unshift(d.asm.m);
                    R--;
                    d.monitorRunDependencies && d.monitorRunDependencies(R);
                    0 == R && (null !== ya && (clearInterval(ya), ya = null), S && (h = S, S = null, h()))
                }

                function b(h) {
                    a(h.instance)
                }

                function e(h) {
                    return Ca().then(function (g) {
                        return WebAssembly.instantiate(g, f)
                    }).then(function (g) {
                        return g
                    }).then(h, function (g) {
                        H("failed to asynchronously prepare wasm: " + g);
                        J(g)
                    })
                }

                var f = {a: Pa};
                R++;
                d.monitorRunDependencies && d.monitorRunDependencies(R);
                if (d.instantiateWasm) try {
                    return d.instantiateWasm(f,
                        a)
                } catch (h) {
                    return H("Module.instantiateWasm callback failed with error: " + h), !1
                }
                (function () {
                    return I || "function" !== typeof WebAssembly.instantiateStreaming || za() || T.startsWith("file://") || "function" !== typeof fetch ? e(b) : fetch(T, {credentials: "same-origin"}).then(function (h) {
                        return WebAssembly.instantiateStreaming(h, f).then(b, function (g) {
                            H("wasm streaming compile failed: " + g);
                            H("falling back to ArrayBuffer instantiation");
                            return e(b)
                        })
                    })
                })().catch(n);
                return {}
            })();
            d.___wasm_call_ctors = function () {
                return (d.___wasm_call_ctors = d.asm.m).apply(null, arguments)
            };
            d._createBuffer = function () {
                return (d._createBuffer = d.asm.n).apply(null, arguments)
            };
            d._deleteBuffer = function () {
                return (d._deleteBuffer = d.asm.o).apply(null, arguments)
            };
            d._triggerDecode = function () {
                return (d._triggerDecode = d.asm.p).apply(null, arguments)
            };
            d._getScanResults = function () {
                return (d._getScanResults = d.asm.q).apply(null, arguments)
            };
            d._main = function () {
                return (d._main = d.asm.r).apply(null, arguments)
            };
            var Oa = d.___errno_location = function () {
                return (Oa = d.___errno_location = d.asm.t).apply(null, arguments)
            }, ka = d.stackSave = function () {
                return (ka = d.stackSave = d.asm.u).apply(null, arguments)
            }, la = d.stackRestore = function () {
                return (la = d.stackRestore = d.asm.v).apply(null, arguments)
            }, M = d.stackAlloc = function () {
                return (M = d.stackAlloc = d.asm.w).apply(null, arguments)
            };
            d.cwrap = function (a, b, e, f) {
                e = e || [];
                var h = e.every(function (g) {
                    return "number" === g
                });
                return "string" !== b && h && !f ? d["_" + a] : function () {
                    return ia(a, b, e, arguments)
                }
            };
            d.UTF8ToString = P;
            var Z;

            function G(a) {
                this.name = "ExitStatus";
                this.message = "Program terminated with exit(" + a + ")";
                this.status = a
            }

            S = function Qa() {
                Z || Ra();
                Z || (S = Qa)
            };

            function Ra(a) {
                function b() {
                    if (!Z && (Z = !0, d.calledRun = !0, !L)) {
                        U(ua);
                        U(va);
                        ba(d);
                        if (d.onRuntimeInitialized) d.onRuntimeInitialized();
                        if (Sa) {
                            var e = a, f = d._main;
                            e = e || [];
                            var h = e.length + 1, g = M(4 * (h + 1));
                            Q[g >> 2] = pa(v);
                            for (var m = 1; m < h; m++) Q[(g >> 2) + m] = pa(e[m - 1]);
                            Q[(g >> 2) + h] = 0;
                            try {
                                var r = f(h, g);
                                if (!(noExitRuntime || 0 < fa)) {
                                    if (d.onExit) d.onExit(r);
                                    L = !0
                                }
                                w(r, new G(r))
                            } catch (t) {
                                t instanceof G || "unwind" == t || w(1, t)
                            } finally {
                            }
                        }
                        if (d.postRun) for ("function" == typeof d.postRun && (d.postRun = [d.postRun]); d.postRun.length;) e = d.postRun.shift(),
                            wa.unshift(e);
                        U(wa)
                    }
                }

                a = a || u;
                if (!(0 < R)) {
                    if (d.preRun) for ("function" == typeof d.preRun && (d.preRun = [d.preRun]); d.preRun.length;) xa();
                    U(ta);
                    0 < R || (d.setStatus ? (d.setStatus("Running..."), setTimeout(function () {
                        setTimeout(function () {
                            d.setStatus("")
                        }, 1);
                        b()
                    }, 1)) : b())
                }
            }

            d.run = Ra;
            if (d.preInit) for ("function" == typeof d.preInit && (d.preInit = [d.preInit]); 0 < d.preInit.length;) d.preInit.pop()();
            var Sa = !0;
            d.noInitialRun && (Sa = !1);
            Ra();


            return CreateKoder.ready
        }
    );
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = CreateKoder;
else if (typeof define === 'function' && define['amd'])
    define([], function () {
        return CreateKoder;
    });
else if (typeof exports === 'object')
    exports["CreateKoder"] = CreateKoder;

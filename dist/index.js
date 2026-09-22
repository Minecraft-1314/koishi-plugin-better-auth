import { useStorage as pe, send as O, message as P, store as y, Schema as ue, useConfig as fe, icons as F, router as G, pick as ve } from "@koishijs/client";
import { ref as V, defineComponent as _, onMounted as he, nextTick as ge, resolveComponent as g, openBlock as s, createElementBlock as d, createElementVNode as t, createVNode as c, unref as N, withCtx as f, withKeys as _e, withModifiers as be, isRef as ke, createTextVNode as H, Transition as ye, toDisplayString as x, createCommentVNode as I, normalizeClass as ce, createBlock as E, computed as D, TransitionGroup as we, Fragment as X, renderList as Y, reactive as de, watch as Z, resolveDynamicComponent as Ce, withDirectives as xe, vShow as Ve } from "vue";
const w = pe("auth", 3, () => ({})), J = V("");
function $e() {
  const l = document.createElement("canvas"), o = l.getContext("2d");
  let e = "";
  return o && (o.textBaseline = "top", o.font = "14px Arial", o.fillText("auth-fingerprint", 2, 2), e = l.toDataURL()), [
    navigator.userAgent,
    navigator.language,
    (screen == null ? void 0 : screen.width) ?? 0,
    (screen == null ? void 0 : screen.height) ?? 0,
    (screen == null ? void 0 : screen.colorDepth) ?? 0,
    (/* @__PURE__ */ new Date()).getTimezoneOffset(),
    e
  ].join("||");
}
const ze = { class: "login-form" }, Me = { class: "form-item" }, Te = { class: "form-item" }, Ee = { class: "options" }, Le = { class: "control" }, Re = ["disabled"], Ae = { class: "btn-text" }, Se = /* @__PURE__ */ _({
  __name: "login-form",
  setup(l) {
    const o = V(), e = V(!1), v = V(!1), u = V(!0), p = V();
    async function $() {
      if (v.value) return;
      const b = w.value.name, i = J.value;
      if (!b || !i) {
        o.value = "请输入用户名和密码";
        return;
      }
      v.value = !0, o.value = void 0;
      try {
        const k = $e();
        await O("login/password", b, i, u.value, k), w.value.name = b, u.value || (w.value.refreshToken = void 0), P.success(`欢迎回来，${b}！`);
      } catch (k) {
        o.value = (k == null ? void 0 : k.message) || "登录失败，请检查用户名和密码";
      } finally {
        v.value = !1;
      }
    }
    return he(() => {
      ge(() => {
        var b;
        (b = p.value) == null || b.focus();
      });
    }), (b, i) => {
      const k = g("k-icon"), B = g("el-input"), j = g("el-checkbox");
      return s(), d("div", ze, [
        t("div", Me, [
          i[6] || (i[6] = t("label", null, "用户名", -1)),
          c(B, {
            ref_key: "nameInputRef",
            ref: p,
            placeholder: "请输入用户名",
            modelValue: N(w).name,
            "onUpdate:modelValue": i[0] || (i[0] = (L) => N(w).name = L),
            onInput: i[1] || (i[1] = (L) => o.value = void 0)
          }, {
            prefix: f(() => [
              c(k, { name: "user" })
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]),
        t("div", Te, [
          i[7] || (i[7] = t("label", null, "密码", -1)),
          c(B, {
            placeholder: "请输入密码",
            modelValue: N(J),
            "onUpdate:modelValue": i[3] || (i[3] = (L) => ke(J) ? J.value = L : null),
            type: e.value ? "text" : "password",
            onKeyup: _e(be($, ["stop"]), ["enter"]),
            onInput: i[4] || (i[4] = (L) => o.value = void 0)
          }, {
            prefix: f(() => [
              c(k, { name: "lock" })
            ]),
            suffix: f(() => [
              t("span", {
                class: "password-toggle",
                onClick: i[2] || (i[2] = (L) => e.value = !e.value)
              }, [
                c(k, {
                  name: e.value ? "eye" : "eye-slash"
                }, null, 8, ["name"])
              ])
            ]),
            _: 1
          }, 8, ["modelValue", "type", "onKeyup"])
        ]),
        t("div", Ee, [
          c(j, {
            modelValue: u.value,
            "onUpdate:modelValue": i[5] || (i[5] = (L) => u.value = L)
          }, {
            default: f(() => [...i[8] || (i[8] = [
              H("记住我", -1)
            ])]),
            _: 1
          }, 8, ["modelValue"])
        ]),
        c(ye, { name: "error" }, {
          default: f(() => [
            o.value ? (s(), d("p", {
              class: "error",
              key: o.value
            }, x(o.value), 1)) : I("", !0)
          ]),
          _: 1
        }),
        t("div", Le, [
          t("button", {
            class: "btn btn-primary",
            disabled: v.value,
            onClick: $
          }, [
            t("span", {
              class: ce(["btn-icon", { loading: v.value }])
            }, null, 2),
            t("span", Ae, x(v.value ? "登录中…" : "登录"), 1)
          ], 8, Re)
        ])
      ]);
    };
  }
}), ee = (l, o) => {
  const e = l.__vccOpts || l;
  for (const [v, u] of o)
    e[v] = u;
  return e;
}, Ue = /* @__PURE__ */ ee(Se, [["__scopeId", "data-v-47c901b3"]]), He = { class: "login-page" }, Ie = { class: "login-container" }, Be = { class: "login-brand" }, Pe = { class: "brand-icon" }, Oe = /* @__PURE__ */ _({
  __name: "login",
  setup(l) {
    return (o, e) => {
      const v = g("k-icon"), u = g("k-card"), p = g("k-layout");
      return s(), E(p, { main: "darker" }, {
        default: f(() => [
          t("div", He, [
            e[3] || (e[3] = t("div", { class: "login-bg" }, [
              t("div", { class: "blob blob-1" }),
              t("div", { class: "blob blob-2" }),
              t("div", { class: "blob blob-3" })
            ], -1)),
            t("div", Ie, [
              c(u, { class: "login-card" }, {
                default: f(() => [
                  t("div", Be, [
                    t("div", Pe, [
                      c(v, { name: "user-full" })
                    ]),
                    e[0] || (e[0] = t("h1", null, "欢迎回来", -1)),
                    e[1] || (e[1] = t("p", null, "登录 Koishi 控制台以继续", -1))
                  ]),
                  c(Ue)
                ]),
                _: 1
              }),
              e[2] || (e[2] = t("p", { class: "login-footer" }, "Koishi Plugin Better Auth", -1))
            ])
          ])
        ]),
        _: 1
      });
    };
  }
}), Ne = /* @__PURE__ */ ee(Oe, [["__scopeId", "data-v-54748e38"]]), Fe = { class: "user-header" }, qe = { class: "user-avatar" }, De = { class: "user-info" }, je = { class: "section-card" }, Ke = { class: "section-title" }, We = { class: "section-card" }, Ge = { class: "section-title" }, Je = {
  key: 0,
  class: "count-badge"
}, Qe = { class: "token-check" }, Xe = { class: "token-device" }, Ye = { class: "token-meta" }, Ze = { class: "token-top" }, et = { class: "token-time" }, tt = { class: "token-detail" }, nt = { class: "detail-item" }, lt = { class: "detail-item" }, ot = { class: "detail-item detail-ua" }, at = { class: "token-actions" }, st = {
  key: 1,
  class: "batch-actions"
}, it = /* @__PURE__ */ _({
  __name: "profile",
  setup(l) {
    const o = {
      password: "密码登录",
      token: "自动登录"
    }, e = V({}), v = V(!1), u = V(!1), p = V(null), $ = V(!1), b = V(!1), i = V([]), k = D(() => {
      var r;
      return ((r = y.user) == null ? void 0 : r.tokens) ?? [];
    }), B = D(() => k.value.length > 0 && k.value.every((r) => i.value.includes(r.inc))), j = D(() => ue.object({
      name: ue.string().description("用户名").default(w.value.name),
      password: ue.string().role("secret").description("密码").default(J.value)
    }).description("基本资料"));
    async function L() {
      const r = {};
      for (const n of Object.keys(e.value))
        e.value[n] !== void 0 && (r[n] = e.value[n]);
      if (!(!Object.keys(r).length || v.value)) {
        v.value = !0;
        try {
          await O("user/update", r), P.success("修改成功！"), r.name !== void 0 && (w.value.name = r.name, y.user && (y.user.name = r.name)), e.value = {};
        } catch (n) {
          P.error((n == null ? void 0 : n.message) || "修改失败");
        } finally {
          v.value = !1;
        }
      }
    }
    async function te() {
      if (!u.value) {
        u.value = !0;
        try {
          await O("user/logout"), y.user = null, w.value.id = void 0, w.value.token = void 0, w.value.expiredAt = void 0, w.value.refreshToken = void 0;
        } catch (r) {
          P.error((r == null ? void 0 : r.message) || "退出登录失败");
        } finally {
          u.value = !1;
        }
      }
    }
    async function ne(r) {
      if (p.value === null) {
        p.value = r;
        try {
          await O("user/delete-token", r), P.success("会话已移除"), y.user && (y.user.tokens = y.user.tokens.filter((n) => n.inc !== r)), i.value = i.value.filter((n) => n !== r);
        } catch (n) {
          P.error((n == null ? void 0 : n.message) || "移除会话失败");
        } finally {
          p.value = null;
        }
      }
    }
    async function le() {
      if (!(!i.value.length || $.value)) {
        $.value = !0;
        try {
          await O("user/delete-tokens", i.value), P.success("已批量移除会话"), y.user && (y.user.tokens = y.user.tokens.filter((r) => !i.value.includes(r.inc))), i.value = [];
        } catch (r) {
          P.error((r == null ? void 0 : r.message) || "批量移除失败");
        } finally {
          $.value = !1;
        }
      }
    }
    function oe() {
      B.value ? i.value = [] : i.value = k.value.map((r) => r.inc);
    }
    function K(r) {
      const n = new Date(r);
      return Number.isNaN(n.getTime()) ? String(r) : n.toLocaleString();
    }
    function q(r) {
      return /Mobile|Android|iPhone|iPad|iPod/i.test(r);
    }
    function ae(r) {
      if (!r) return "未知";
      if (r.includes(":")) {
        const a = r.split(":");
        return `${a.slice(0, Math.max(1, a.length - 2)).join(":")}:**`;
      }
      const n = r.split(".");
      return n.length === 4 ? `${n[0]}.${n[1]}.**.**` : r;
    }
    function se(r) {
      return r ? r.replace(/^Mozilla\/5\.0 \(([^;]+); ([^;]+); ([^)]+)\).*$/, "$1 $2") : "未知";
    }
    const ie = D(() => [{
      icon: "check",
      label: "应用更改",
      disabled: !Object.keys(e.value).length || v.value,
      action: L
    }, {
      type: "danger",
      icon: "sign-out",
      label: "退出登录",
      disabled: u.value,
      action: te
    }]);
    return (r, n) => {
      const a = g("k-icon"), h = g("k-form"), M = g("el-checkbox"), S = g("el-checkbox-group"), R = g("el-button"), A = g("el-empty"), U = g("k-content"), re = g("k-layout");
      return s(), E(re, {
        main: "page-profile",
        menu: ie.value
      }, {
        default: f(() => [
          c(U, null, {
            default: f(() => {
              var Q;
              return [
                t("div", Fe, [
                  t("div", qe, [
                    c(a, { name: "user-full" })
                  ]),
                  t("div", De, [
                    t("h1", null, x(((Q = N(y).user) == null ? void 0 : Q.name) || "用户资料"), 1),
                    n[3] || (n[3] = t("p", null, "管理你的个人资料与登录会话", -1))
                  ]),
                  n[4] || (n[4] = t("div", { class: "user-status" }, [
                    t("span", { class: "status-dot" }),
                    t("span", null, "已登录")
                  ], -1))
                ]),
                t("div", je, [
                  t("div", Ke, [
                    c(a, { name: "edit" }),
                    n[5] || (n[5] = t("span", null, "基本资料", -1))
                  ]),
                  c(h, {
                    schema: j.value,
                    modelValue: e.value,
                    "onUpdate:modelValue": n[0] || (n[0] = (z) => e.value = z)
                  }, null, 8, ["schema", "modelValue"])
                ]),
                t("div", We, [
                  t("div", Ge, [
                    c(a, { name: "clock" }),
                    n[6] || (n[6] = t("span", null, "登录历史", -1)),
                    k.value.length ? (s(), d("span", Je, x(k.value.length), 1)) : I("", !0)
                  ]),
                  c(we, {
                    name: "token",
                    tag: "div",
                    class: "token-list"
                  }, {
                    default: f(() => [
                      (s(!0), d(X, null, Y(k.value, (z) => (s(), d("div", {
                        class: "token-item",
                        key: z.inc
                      }, [
                        t("div", Qe, [
                          c(S, {
                            modelValue: i.value,
                            "onUpdate:modelValue": n[1] || (n[1] = (W) => i.value = W)
                          }, {
                            default: f(() => [
                              c(M, {
                                value: z.inc
                              }, null, 8, ["value"])
                            ]),
                            _: 2
                          }, 1032, ["modelValue"])
                        ]),
                        t("div", Xe, [
                          c(a, {
                            name: q(z.userAgent) ? "mobile" : "desktop"
                          }, null, 8, ["name"])
                        ]),
                        t("div", Ye, [
                          t("div", Ze, [
                            t("span", {
                              class: ce(["type-tag", z.type])
                            }, x(o[z.type] || z.type), 3),
                            t("span", et, "登录于 " + x(K(z.createdAt)), 1)
                          ]),
                          t("div", tt, [
                            t("span", nt, [
                              c(a, { name: "clock" }),
                              H(" 最后访问 " + x(K(z.lastUsedAt)), 1)
                            ]),
                            t("span", lt, [
                              n[7] || (n[7] = t("span", { class: "detail-label" }, "IP", -1)),
                              H(" " + x(b.value ? z.address : ae(z.address)) + " ", 1),
                              c(R, {
                                class: "action-btn ip-btn",
                                size: "small",
                                text: "",
                                onClick: n[2] || (n[2] = (W) => b.value = !b.value)
                              }, {
                                default: f(() => [
                                  H(x(b.value ? "隐藏" : "显示"), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            t("span", ot, x(se(z.userAgent)), 1)
                          ])
                        ]),
                        t("div", at, [
                          c(R, {
                            class: "action-btn remove-btn",
                            size: "small",
                            loading: p.value === z.inc,
                            onClick: (W) => ne(z.inc)
                          }, {
                            default: f(() => [...n[8] || (n[8] = [
                              H("移除会话", -1)
                            ])]),
                            _: 1
                          }, 8, ["loading", "onClick"])
                        ])
                      ]))), 128))
                    ]),
                    _: 1
                  }),
                  k.value.length ? I("", !0) : (s(), E(A, {
                    key: 0,
                    description: "暂无登录历史"
                  })),
                  k.value.length ? (s(), d("div", st, [
                    c(R, {
                      class: "action-btn select-btn",
                      size: "small",
                      onClick: oe
                    }, {
                      default: f(() => [
                        H(x(B.value ? "取消全选" : "全选"), 1)
                      ]),
                      _: 1
                    }),
                    c(R, {
                      class: "action-btn danger-btn",
                      size: "small",
                      loading: $.value,
                      disabled: !i.value.length,
                      onClick: le
                    }, {
                      default: f(() => [
                        H("批量移除 (" + x(i.value.length) + ")", 1)
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ])) : I("", !0)
                ])
              ];
            }),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["menu"]);
    };
  }
}), rt = /* @__PURE__ */ ee(it, [["__scopeId", "data-v-2b6e89a7"]]);
/*! Element Plus Icons Vue v2.3.2 */
var ut = /* @__PURE__ */ _({
  name: "ArrowDown",
  __name: "arrow-down",
  setup(l) {
    return (o, e) => (s(), d("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      t("path", {
        fill: "currentColor",
        d: "M831.872 340.864 512 652.672 192.128 340.864a30.59 30.59 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.59 30.59 0 0 0-42.752 0z"
      })
    ]));
  }
}), ct = ut, dt = /* @__PURE__ */ _({
  name: "Bell",
  __name: "bell",
  setup(l) {
    return (o, e) => (s(), d("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      t("path", {
        fill: "currentColor",
        d: "M512 64a64 64 0 0 1 64 64v64H448v-64a64 64 0 0 1 64-64"
      }),
      t("path", {
        fill: "currentColor",
        d: "M256 768h512V448a256 256 0 1 0-512 0zm256-640a320 320 0 0 1 320 320v384H192V448a320 320 0 0 1 320-320"
      }),
      t("path", {
        fill: "currentColor",
        d: "M96 768h832q32 0 32 32t-32 32H96q-32 0-32-32t32-32m352 128h128a64 64 0 0 1-128 0"
      })
    ]));
  }
}), mt = dt, pt = /* @__PURE__ */ _({
  name: "Check",
  __name: "check",
  setup(l) {
    return (o, e) => (s(), d("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      t("path", {
        fill: "currentColor",
        d: "M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"
      })
    ]));
  }
}), ft = pt, vt = /* @__PURE__ */ _({
  name: "Clock",
  __name: "clock",
  setup(l) {
    return (o, e) => (s(), d("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      t("path", {
        fill: "currentColor",
        d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
      }),
      t("path", {
        fill: "currentColor",
        d: "M480 256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32"
      }),
      t("path", {
        fill: "currentColor",
        d: "M480 512h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32"
      })
    ]));
  }
}), ht = vt, gt = /* @__PURE__ */ _({
  name: "Key",
  __name: "key",
  setup(l) {
    return (o, e) => (s(), d("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      t("path", {
        fill: "currentColor",
        d: "M448 456.064V96a32 32 0 0 1 32-32.064L672 64a32 32 0 0 1 0 64H512v128h160a32 32 0 0 1 0 64H512v128a256 256 0 1 1-64 8.064M512 896a192 192 0 1 0 0-384 192 192 0 0 0 0 384"
      })
    ]));
  }
}), _t = gt, bt = /* @__PURE__ */ _({
  name: "Lock",
  __name: "lock",
  setup(l) {
    return (o, e) => (s(), d("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      t("path", {
        fill: "currentColor",
        d: "M224 448a32 32 0 0 0-32 32v384a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32V480a32 32 0 0 0-32-32zm0-64h576a96 96 0 0 1 96 96v384a96 96 0 0 1-96 96H224a96 96 0 0 1-96-96V480a96 96 0 0 1 96-96"
      }),
      t("path", {
        fill: "currentColor",
        d: "M512 544a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V576a32 32 0 0 1 32-32m192-160v-64a192 192 0 1 0-384 0v64zM512 64a256 256 0 0 1 256 256v128H256V320A256 256 0 0 1 512 64"
      })
    ]));
  }
}), kt = bt, yt = /* @__PURE__ */ _({
  name: "Monitor",
  __name: "monitor",
  setup(l) {
    return (o, e) => (s(), d("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      t("path", {
        fill: "currentColor",
        d: "M544 768v128h192a32 32 0 1 1 0 64H288a32 32 0 1 1 0-64h192V768H192A128 128 0 0 1 64 640V256a128 128 0 0 1 128-128h640a128 128 0 0 1 128 128v384a128 128 0 0 1-128 128zM192 192a64 64 0 0 0-64 64v384a64 64 0 0 0 64 64h640a64 64 0 0 0 64-64V256a64 64 0 0 0-64-64z"
      })
    ]));
  }
}), wt = yt, Ct = /* @__PURE__ */ _({
  name: "RefreshLeft",
  __name: "refresh-left",
  setup(l) {
    return (o, e) => (s(), d("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      t("path", {
        fill: "currentColor",
        d: "M289.088 296.704h92.992a32 32 0 0 1 0 64H232.96a32 32 0 0 1-32-32V179.712a32 32 0 0 1 64 0v50.56a384 384 0 0 1 643.84 282.88 384 384 0 0 1-383.936 384 384 384 0 0 1-384-384h64a320 320 0 1 0 640 0 320 320 0 0 0-555.712-216.448z"
      })
    ]));
  }
}), xt = Ct, Vt = /* @__PURE__ */ _({
  name: "Search",
  __name: "search",
  setup(l) {
    return (o, e) => (s(), d("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      t("path", {
        fill: "currentColor",
        d: "m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704"
      })
    ]));
  }
}), $t = Vt, zt = /* @__PURE__ */ _({
  name: "User",
  __name: "user",
  setup(l) {
    return (o, e) => (s(), d("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      t("path", {
        fill: "currentColor",
        d: "M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384m0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512m320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0"
      })
    ]));
  }
}), Mt = zt;
const Tt = { class: "ba-config" }, Et = { class: "ba-config-toolbar" }, Lt = { class: "ba-config-actions" }, Rt = { class: "ba-config-modules" }, At = ["onClick"], St = { class: "ba-module-title" }, Ut = { class: "ba-module-meta" }, Ht = { class: "ba-module-body" }, It = { class: "ba-module-desc" }, Bt = { class: "ba-module-items" }, Pt = { class: "ba-field-header" }, Ot = { class: "ba-field-label" }, Nt = {
  key: 0,
  class: "ba-field-default"
}, Ft = { class: "ba-field-control" }, qt = { class: "ba-field-footer" }, Dt = { class: "ba-field-hint" }, jt = {
  key: 0,
  class: "ba-field-error"
}, Kt = _({
  name: "BaConfigPage"
}), Wt = /* @__PURE__ */ _({
  ...Kt,
  setup(l) {
    const o = fe(!0), e = de({
      adminEnabled: !0,
      adminUsername: "admin",
      adminPassword: "",
      maxLoginAttempts: 5,
      lockTime: 900,
      idleTimeout: 1800,
      passwordMinLength: 6,
      passwordRequireSpecialChar: !1,
      authExpire: 604800,
      refreshExpire: 2592e3,
      rememberExpire: 2592e3,
      maxTokensPerUser: 20,
      revokeOnPasswordChange: !0,
      cleanupEnabled: !0,
      cleanupInterval: 3600,
      tokenRetention: 604800,
      refreshTokenRetention: 2592e3,
      attemptRetention: 86400,
      notifyEnabled: !1,
      notifyTarget: "",
      notifyRobotId: "",
      loginSuccess: !0,
      loginFail: !1,
      debugEnabled: !1,
      logTokenOps: !1,
      logLoginAttempts: !1,
      logNotifications: !1,
      logCleanup: !1,
      logExtensions: !1
    }), v = V(""), u = V(["basic", "security", "token"]), p = V(!1), $ = V(""), b = V("success"), i = de({}), k = [
      {
        key: "basic",
        title: "基础设置",
        icon: Mt,
        description: "管理员账号与基础运行参数",
        order: 1,
        fields: [
          { key: "adminEnabled", label: "启用管理员账号", type: "boolean", default: !0, hint: "启用后将自动创建/确保管理员账号存在" },
          { key: "adminUsername", label: "管理员用户名", type: "string", default: "admin", hint: "管理员账号的用户名" },
          { key: "adminPassword", label: "管理员密码", type: "password", default: "", hint: "修改后将自动更新管理员密码" }
        ]
      },
      {
        key: "security",
        title: "安全设置",
        icon: kt,
        description: "登录限制、密码策略与空闲超时",
        order: 2,
        fields: [
          { key: "maxLoginAttempts", label: "最大登录尝试次数", type: "number", default: 5, min: 1, max: 50, hint: "超出后将触发登录锁定" },
          { key: "lockTime", label: "登录锁定时间（秒）", type: "number", default: 900, min: 60, hint: "登录失败过多后的锁定时长" },
          { key: "idleTimeout", label: "空闲超时时间（秒）", type: "number", default: 1800, min: 0, hint: "0 表示不限制，超时后自动退出登录" },
          { key: "passwordMinLength", label: "密码最小长度", type: "number", default: 6, min: 4, max: 32, hint: "建议不小于 6 位" },
          { key: "passwordRequireSpecialChar", label: "密码必须包含特殊字符", type: "boolean", default: !1, hint: "启用后会要求密码包含特殊字符" }
        ]
      },
      {
        key: "token",
        title: "令牌设置",
        icon: _t,
        description: "令牌有效期、刷新令牌与会话上限",
        order: 3,
        fields: [
          { key: "authExpire", label: "用户令牌有效期（秒）", type: "number", default: 604800, min: 60, hint: "默认 7 天" },
          { key: "refreshExpire", label: "刷新令牌有效期（秒）", type: "number", default: 2592e3, min: 60, hint: "默认 30 天" },
          { key: "rememberExpire", label: "记住我令牌有效期（秒）", type: "number", default: 2592e3, min: 60, hint: "默认 30 天" },
          { key: "maxTokensPerUser", label: "每个用户最大令牌数", type: "number", default: 20, min: 1, hint: "超出后自动移除最早令牌" },
          { key: "revokeOnPasswordChange", label: "修改密码时撤销所有令牌", type: "boolean", default: !0, hint: "提升安全性，但会要求重新登录" }
        ]
      },
      {
        key: "cleanup",
        title: "数据清理",
        icon: ht,
        description: "过期令牌、刷新令牌与登录尝试记录清理",
        order: 4,
        fields: [
          { key: "cleanupEnabled", label: "启用自动数据清理", type: "boolean", default: !0, hint: "定时清理过期数据以降低存储占用" },
          { key: "cleanupInterval", label: "清理间隔（秒）", type: "number", default: 3600, min: 300, hint: "建议不少于 300 秒" },
          { key: "tokenRetention", label: "令牌保留时间（秒）", type: "number", default: 604800, min: 60, hint: "过期令牌的保留时长" },
          { key: "refreshTokenRetention", label: "刷新令牌保留时间（秒）", type: "number", default: 2592e3, min: 60, hint: "默认 30 天" },
          { key: "attemptRetention", label: "登录尝试记录保留时间（秒）", type: "number", default: 86400, min: 60, hint: "默认 1 天" }
        ]
      },
      {
        key: "notification",
        title: "登录提醒",
        icon: mt,
        description: "登录成功/失败时的群聊提醒",
        order: 5,
        fields: [
          { key: "notifyEnabled", label: "启用登录提醒", type: "boolean", default: !1, hint: "需要机器人插件可发送消息" },
          { key: "notifyTarget", label: "目标群号", type: "string", default: "", hint: "接收提醒的群号" },
          { key: "notifyRobotId", label: "指定机器人账号", type: "string", default: "", hint: "留空自动使用第一个可用机器人" },
          { key: "loginSuccess", label: "登录成功时发送提醒", type: "boolean", default: !0, hint: "登录成功时发送提醒" },
          { key: "loginFail", label: "登录失败时发送提醒", type: "boolean", default: !1, hint: "登录失败时发送提醒" }
        ]
      },
      {
        key: "debug",
        title: "调试设置",
        icon: wt,
        description: "后端调试日志开关，仅输出到运行日志",
        order: 6,
        advanced: !0,
        fields: [
          { key: "debugEnabled", label: "启用调试日志", type: "boolean", default: !1, hint: "仅输出到后端日志，不影响前端性能" },
          { key: "logTokenOps", label: "记录令牌操作日志", type: "boolean", default: !1, hint: "记录令牌创建/撤销操作" },
          { key: "logLoginAttempts", label: "记录登录尝试日志", type: "boolean", default: !1, hint: "记录成功/失败登录尝试" },
          { key: "logNotifications", label: "记录通知发送日志", type: "boolean", default: !1, hint: "记录登录提醒发送结果" },
          { key: "logCleanup", label: "记录数据清理日志", type: "boolean", default: !1, hint: "记录清理任务的执行结果" },
          { key: "logExtensions", label: "记录扩展钩子日志", type: "boolean", default: !1, hint: "记录扩展钩子执行情况" }
        ]
      }
    ], B = D(() => k.slice().sort((n, a) => n.order - a.order)), j = D(() => {
      const n = v.value.trim().toLowerCase();
      return n ? B.value.map((a) => {
        const h = a.fields.filter((M) => M.label.toLowerCase().includes(n) || M.hint.toLowerCase().includes(n));
        return h.length ? { ...a, fields: h } : null;
      }).filter(Boolean) : B.value;
    });
    function L(n) {
      return ["debug"].includes(n);
    }
    function te(n) {
      return [];
    }
    function ne(n) {
      return ["debug"].includes(n);
    }
    function le(n) {
      const a = u.value.indexOf(n);
      a >= 0 ? u.value.splice(a, 1) : u.value.push(n);
    }
    function oe(n) {
      return typeof n == "boolean" ? n ? "是" : "否" : (Number.isInteger(n), String(n));
    }
    function K(n) {
      const a = e[n.key];
      if (n.type === "number") {
        if (n.min !== void 0 && Number(a) < n.min)
          return i[n.key] = `最小值为 ${n.min}`, !1;
        if (n.max !== void 0 && Number(a) > n.max)
          return i[n.key] = `最大值为 ${n.max}`, !1;
      }
      return delete i[n.key], !0;
    }
    function q(n) {
      K(n);
    }
    function ae() {
      return {
        admin: {
          enabled: e.adminEnabled,
          username: e.adminUsername,
          password: e.adminPassword || void 0
        },
        security: {
          maxLoginAttempts: e.maxLoginAttempts,
          lockTime: e.lockTime,
          idleTimeout: e.idleTimeout,
          passwordMinLength: e.passwordMinLength,
          passwordRequireSpecialChar: e.passwordRequireSpecialChar,
          passwordHashAlgorithm: "sha256"
        },
        token: {
          authExpire: e.authExpire,
          refreshExpire: e.refreshExpire,
          rememberExpire: e.rememberExpire,
          maxTokensPerUser: e.maxTokensPerUser,
          revokeOnPasswordChange: e.revokeOnPasswordChange
        },
        cleanup: {
          enabled: e.cleanupEnabled,
          interval: e.cleanupInterval,
          tokenRetention: e.tokenRetention,
          refreshTokenRetention: e.refreshTokenRetention,
          attemptRetention: e.attemptRetention
        },
        notification: {
          enabled: e.notifyEnabled,
          target: e.notifyTarget,
          robotId: e.notifyRobotId,
          loginSuccess: e.loginSuccess,
          loginFail: e.loginFail
        },
        debug: {
          enabled: e.debugEnabled,
          logTokenOps: e.logTokenOps,
          logLoginAttempts: e.logLoginAttempts,
          logNotifications: e.logNotifications,
          logCleanup: e.logCleanup,
          logExtensions: e.logExtensions
        }
      };
    }
    async function se() {
      if (!B.value.flatMap((h) => h.fields).every(K)) {
        $.value = "请修正配置项错误后再保存", b.value = "error";
        return;
      }
      p.value = !0, $.value = "";
      try {
        await O("config/better-auth/update", ae()), $.value = "配置已保存", b.value = "success";
      } catch (h) {
        $.value = (h == null ? void 0 : h.message) || "保存失败", b.value = "error";
      } finally {
        p.value = !1;
      }
    }
    function ie() {
      const n = u.value[0];
      if (!n) return;
      const a = k.find((h) => h.key === n);
      if (a) {
        for (const h of a.fields)
          e[h.key] = h.default, delete i[h.key];
        $.value = "已重置当前模块为默认值", b.value = "info";
      }
    }
    Z(() => o.value, (n) => {
      r(n);
    }, { immediate: !0, deep: !0 });
    function r(n) {
      const a = (n == null ? void 0 : n.betterAuth) ?? (n == null ? void 0 : n.better_auth) ?? {}, h = a.admin ?? {}, M = a.security ?? {}, S = a.token ?? {}, R = a.cleanup ?? {}, A = a.notification ?? {}, U = a.debug ?? {};
      e.adminEnabled = h.enabled ?? !0, e.adminUsername = h.username ?? "admin", e.adminPassword = h.password ?? "", e.maxLoginAttempts = M.maxLoginAttempts ?? 5, e.lockTime = M.lockTime ?? 900, e.idleTimeout = M.idleTimeout ?? 1800, e.passwordMinLength = M.passwordMinLength ?? 6, e.passwordRequireSpecialChar = M.passwordRequireSpecialChar ?? !1, e.authExpire = S.authExpire ?? 604800, e.refreshExpire = S.refreshExpire ?? 2592e3, e.rememberExpire = S.rememberExpire ?? 2592e3, e.maxTokensPerUser = S.maxTokensPerUser ?? 20, e.revokeOnPasswordChange = S.revokeOnPasswordChange ?? !0, e.cleanupEnabled = R.enabled ?? !0, e.cleanupInterval = R.interval ?? 3600, e.tokenRetention = R.tokenRetention ?? 604800, e.refreshTokenRetention = R.refreshTokenRetention ?? 2592e3, e.attemptRetention = R.attemptRetention ?? 86400, e.notifyEnabled = A.enabled ?? !1, e.notifyTarget = A.target ?? "", e.notifyRobotId = A.robotId ?? "", e.loginSuccess = A.loginSuccess ?? !0, e.loginFail = A.loginFail ?? !1, e.debugEnabled = U.enabled ?? !1, e.logTokenOps = U.logTokenOps ?? !1, e.logLoginAttempts = U.logLoginAttempts ?? !1, e.logNotifications = U.logNotifications ?? !1, e.logCleanup = U.logCleanup ?? !1, e.logExtensions = U.logExtensions ?? !1;
    }
    return (n, a) => {
      const h = g("el-icon"), M = g("el-input"), S = g("el-button"), R = g("el-alert"), A = g("el-tag"), U = g("el-switch"), re = g("el-input-number"), Q = g("el-option"), z = g("el-select"), W = g("el-collapse-transition");
      return s(), d("div", Tt, [
        a[7] || (a[7] = t("div", { class: "ba-config-header" }, [
          t("h1", null, "Better Auth 插件设置"),
          t("p", { class: "ba-config-desc" }, "管理认证、令牌、安全、通知与调试配置")
        ], -1)),
        t("div", Et, [
          c(M, {
            modelValue: v.value,
            "onUpdate:modelValue": a[0] || (a[0] = (T) => v.value = T),
            placeholder: "搜索配置项",
            clearable: "",
            class: "ba-config-search"
          }, {
            prefix: f(() => [
              c(h, null, {
                default: f(() => [
                  c(N($t))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"]),
          t("div", Lt, [
            c(S, { onClick: ie }, {
              default: f(() => [
                c(h, null, {
                  default: f(() => [
                    c(N(xt))
                  ]),
                  _: 1
                }),
                a[2] || (a[2] = t("span", null, "重置当前模块", -1))
              ]),
              _: 1
            }),
            c(S, {
              type: "primary",
              loading: p.value,
              onClick: se
            }, {
              default: f(() => [
                c(h, null, {
                  default: f(() => [
                    c(N(ft))
                  ]),
                  _: 1
                }),
                a[3] || (a[3] = t("span", null, "保存配置", -1))
              ]),
              _: 1
            }, 8, ["loading"])
          ])
        ]),
        $.value ? (s(), E(R, {
          key: 0,
          title: $.value,
          type: b.value,
          closable: !0,
          onClose: a[1] || (a[1] = (T) => $.value = ""),
          class: "ba-config-message"
        }, null, 8, ["title", "type"])) : I("", !0),
        t("div", Rt, [
          (s(!0), d(X, null, Y(j.value, (T) => (s(), d("div", {
            key: T.key,
            class: "ba-config-module"
          }, [
            t("div", {
              class: "ba-module-header",
              onClick: (m) => le(T.key)
            }, [
              t("div", St, [
                c(h, null, {
                  default: f(() => [
                    (s(), E(Ce(T.icon)))
                  ]),
                  _: 2
                }, 1024),
                t("span", null, x(T.title), 1)
              ]),
              t("div", Ut, [
                L(T.key) ? (s(), E(A, {
                  key: 0,
                  type: "info",
                  size: "small"
                }, {
                  default: f(() => [...a[4] || (a[4] = [
                    H("高级", -1)
                  ])]),
                  _: 1
                })) : I("", !0),
                te(T.key) ? (s(), E(A, {
                  key: 1,
                  type: "warning",
                  size: "small"
                }, {
                  default: f(() => [...a[5] || (a[5] = [
                    H("实验", -1)
                  ])]),
                  _: 1
                })) : I("", !0),
                ne(T.key) ? (s(), E(A, {
                  key: 2,
                  type: "danger",
                  size: "small"
                }, {
                  default: f(() => [...a[6] || (a[6] = [
                    H("调试", -1)
                  ])]),
                  _: 1
                })) : I("", !0),
                c(h, {
                  class: ce(["ba-module-arrow", { "is-expanded": u.value.includes(T.key) }])
                }, {
                  default: f(() => [
                    c(N(ct))
                  ]),
                  _: 1
                }, 8, ["class"])
              ])
            ], 8, At),
            c(W, null, {
              default: f(() => [
                xe(t("div", Ht, [
                  t("div", It, x(T.description), 1),
                  t("div", Bt, [
                    (s(!0), d(X, null, Y(T.fields, (m) => (s(), d("div", {
                      key: m.key,
                      class: "ba-field"
                    }, [
                      t("div", Pt, [
                        t("label", Ot, x(m.label), 1),
                        m.default !== void 0 ? (s(), d("span", Nt, "默认：" + x(oe(m.default)), 1)) : I("", !0)
                      ]),
                      t("div", Ft, [
                        m.type === "boolean" ? (s(), E(U, {
                          key: 0,
                          modelValue: e[m.key],
                          "onUpdate:modelValue": (C) => e[m.key] = C,
                          disabled: p.value,
                          onChange: (C) => q(m)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "onChange"])) : m.type === "number" ? (s(), E(re, {
                          key: 1,
                          modelValue: e[m.key],
                          "onUpdate:modelValue": (C) => e[m.key] = C,
                          disabled: p.value,
                          min: m.min,
                          max: m.max,
                          step: m.step ?? 1,
                          onChange: (C) => q(m)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "min", "max", "step", "onChange"])) : m.type === "select" ? (s(), E(z, {
                          key: 2,
                          modelValue: e[m.key],
                          "onUpdate:modelValue": (C) => e[m.key] = C,
                          disabled: p.value,
                          onChange: (C) => q(m)
                        }, {
                          default: f(() => [
                            (s(!0), d(X, null, Y(m.options, (C) => (s(), E(Q, {
                              key: C.value,
                              label: C.label,
                              value: C.value
                            }, null, 8, ["label", "value"]))), 128))
                          ]),
                          _: 2
                        }, 1032, ["modelValue", "onUpdate:modelValue", "disabled", "onChange"])) : m.type === "password" ? (s(), E(M, {
                          key: 3,
                          modelValue: e[m.key],
                          "onUpdate:modelValue": (C) => e[m.key] = C,
                          disabled: p.value,
                          type: "password",
                          "show-password": "",
                          onInput: (C) => q(m)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "onInput"])) : (s(), E(M, {
                          key: 4,
                          modelValue: e[m.key],
                          "onUpdate:modelValue": (C) => e[m.key] = C,
                          disabled: p.value,
                          onInput: (C) => q(m)
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "onInput"]))
                      ]),
                      t("div", qt, [
                        t("span", Dt, x(m.hint), 1),
                        i[m.key] ? (s(), d("span", jt, x(i[m.key]), 1)) : I("", !0)
                      ])
                    ]))), 128))
                  ])
                ], 512), [
                  [Ve, u.value.includes(T.key)]
                ])
              ]),
              _: 2
            }, 1024)
          ]))), 128))
        ])
      ]);
    };
  }
}), Gt = /* @__PURE__ */ ee(Wt, [["__scopeId", "data-v-361b4e43"]]), Jt = ["width", "height", "fill"], Qt = /* @__PURE__ */ _({
  __name: "check",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(l) {
    return (o, e) => (s(), d("svg", {
      class: "k-icon check",
      width: l.size,
      height: l.size,
      fill: l.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 448 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z" }, null, -1)
    ])], 8, Jt));
  }
}), Xt = ["width", "height", "fill"], Yt = /* @__PURE__ */ _({
  __name: "clock",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(l) {
    return (o, e) => (s(), d("svg", {
      class: "k-icon k-icon-clock",
      width: l.size,
      height: l.size,
      fill: l.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.3 275.1L330.3 339.1C338.2 345.3 348.5 343.3 354.8 335.4C361.1 327.4 359.1 317.2 351.2 310.9L264.1 247.1C264 247.4 264 246.8 264 246.8V128C264 113.1 254 104 240 104C226 104 216 113.1 216 128V256z" }, null, -1)
    ])], 8, Xt));
  }
}), Zt = ["width", "height", "fill"], en = /* @__PURE__ */ _({
  __name: "desktop",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(l) {
    return (o, e) => (s(), d("svg", {
      class: "k-icon k-icon-desktop",
      width: l.size,
      height: l.size,
      fill: l.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 576 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h192l-16 48h-72c-13.25 0-24 10.75-24 24s10.75 24 24 24h272c13.25 0 24-10.75 24-24s-10.75-24-24-24h-72l-16-48h192c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-16 352H64V64h448v288z" }, null, -1)
    ])], 8, Zt));
  }
}), tn = ["width", "height", "fill"], nn = /* @__PURE__ */ _({
  __name: "lock",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(l) {
    return (o, e) => (s(), d("svg", {
      class: "k-icon k-icon-lock",
      width: l.size,
      height: l.size,
      fill: l.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 448 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z" }, null, -1)
    ])], 8, tn));
  }
}), ln = ["width", "height", "fill"], on = /* @__PURE__ */ _({
  __name: "mobile",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(l) {
    return (o, e) => (s(), d("svg", {
      class: "k-icon k-icon-mobile",
      width: l.size,
      height: l.size,
      fill: l.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M16 64C16 28.65 44.65 0 80 0H304C339.3 0 368 28.65 368 64V448C368 483.3 339.3 512 304 512H80C44.65 512 16 483.3 16 448V64zM224 448C224 434.7 213.3 424 200 424C186.7 424 176 434.7 176 448C176 461.3 186.7 472 200 472C213.3 472 224 461.3 224 448zM112 64V96H272V64H112z" }, null, -1)
    ])], 8, ln));
  }
}), an = ["width", "height", "fill"], sn = /* @__PURE__ */ _({
  __name: "sign-in",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(l) {
    return (o, e) => (s(), d("svg", {
      class: "k-icon k-icon-sign-in",
      width: l.size,
      height: l.size,
      fill: l.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M384 256c0-8.188-3.125-16.38-9.375-22.62l-128-128C237.5 96.22 223.7 93.47 211.8 98.44C199.8 103.4 192 115.1 192 128v64H48C21.49 192 0 213.5 0 240v32C0 298.5 21.49 320 48 320H192v64c0 12.94 7.797 24.62 19.75 29.56c11.97 4.969 25.72 2.219 34.88-6.938l128-128C380.9 272.4 384 264.2 384 256zM224 384V288H48C39.18 288 32 280.8 32 272v-32C32 231.2 39.18 224 48 224H224L223.1 128l128 128L224 384zM432 32h-96C327.2 32 320 39.16 320 48S327.2 64 336 64h96C458.5 64 480 85.53 480 112v288c0 26.47-21.53 48-48 48h-96c-8.844 0-16 7.156-16 16s7.156 16 16 16h96c44.13 0 80-35.88 80-80v-288C512 67.88 476.1 32 432 32z" }, null, -1)
    ])], 8, an));
  }
}), rn = ["width", "height", "fill"], un = /* @__PURE__ */ _({
  __name: "sign-out",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(l) {
    return (o, e) => (s(), d("svg", {
      class: "k-icon k-icon-sign-out",
      width: l.size,
      height: l.size,
      fill: l.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M176 448h-96C53.53 448 32 426.5 32 400v-288C32 85.53 53.53 64 80 64h96C184.8 64 192 56.84 192 48S184.8 32 176 32h-96C35.88 32 0 67.88 0 112v288C0 444.1 35.88 480 80 480h96C184.8 480 192 472.8 192 464S184.8 448 176 448zM502.6 233.4l-128-128c-9.156-9.156-22.91-11.91-34.88-6.938C327.8 103.4 320 115.1 320 128l.0918 63.1L176 192C149.5 192 128 213.5 128 240v32C128 298.5 149.5 320 176 320l144.1-.001L320 384c0 12.94 7.797 24.62 19.75 29.56c11.97 4.969 25.72 2.219 34.88-6.938l128-128C508.9 272.4 512 264.2 512 256S508.9 239.6 502.6 233.4zM352 384V288H176C167.2 288 160 280.8 160 272v-32C160 231.2 167.2 224 176 224H352l-.0039-96l128 128L352 384z" }, null, -1)
    ])], 8, rn));
  }
}), cn = ["width", "height", "fill"], dn = /* @__PURE__ */ _({
  __name: "user-full",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(l) {
    return (o, e) => (s(), d("svg", {
      class: "k-icon",
      width: l.size,
      height: l.size,
      fill: l.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 480c-47.24 0-91.04-14.78-127.2-39.84C132.9 390.9 173.8 352 224 352h64c50.25 0 91.14 38.94 95.21 88.16C347 465.2 303.2 480 256 480zM411.7 416.7C397.6 361.3 347.7 320 288 320H224c-59.73 0-109.6 41.3-123.7 96.72C58.27 375.1 32 319 32 256c0-123.5 100.5-224 224-224s224 100.5 224 224C480 319 453.7 375.1 411.7 416.7zM256 128C211.8 128 176 163.8 176 208C176 252.2 211.8 288 256 288s80-35.82 80-80C336 163.8 300.2 128 256 128zM256 256C229.5 256 208 234.5 208 208S229.5 160 256 160s48 21.53 48 48S282.5 256 256 256z" }, null, -1)
    ])], 8, cn));
  }
});
F.register("check", Qt);
F.register("clock", Yt);
F.register("desktop", en);
F.register("lock", nn);
F.register("mobile", on);
F.register("sign-in", sn);
F.register("sign-out", un);
F.register("user-full", dn);
function me() {
  w.value.id = void 0, w.value.name = void 0, w.value.token = void 0, w.value.expiredAt = void 0, w.value.refreshToken = void 0;
}
async function mn() {
  const { id: l, token: o, expiredAt: e, refreshToken: v } = w.value;
  if (l && o && e && e > Date.now()) {
    try {
      await O("login/token", l, o);
    } catch {
      me();
    }
    return;
  }
  if (v)
    try {
      await O("login/refresh", v);
    } catch {
      me();
    }
}
const vn = (l) => {
  mn(), l.on("activity", (u) => u.authority > 0 && (!y.user || y.user.authority < u.authority)), l.scope.disposables.push(G.beforeEach((u) => {
    var b, i;
    const { activity: p } = u.meta;
    if (!p) return;
    if ((p.authority > 0 || ((b = p.fields) == null ? void 0 : b.includes("user"))) && !y.user)
      return u.path === "/login" ? void 0 : "/login";
    if (p.authority && p.authority > (((i = y.user) == null ? void 0 : i.authority) ?? 0))
      return P.error("权限不足。"), !1;
    if (y.user && u.path === "/login")
      return "/profile";
  })), l.page({
    path: "/login",
    name: "登录",
    icon: "sign-in",
    position: "bottom",
    order: 500,
    disabled: () => !!y.user,
    component: Ne
  }), l.page({
    path: "/profile",
    name: "用户资料",
    icon: "user-full",
    fields: ["user"],
    position: "bottom",
    order: 500,
    component: rt
  }), l.settings({
    id: "better-auth",
    title: "Better Auth",
    order: 900,
    component: Gt
  }), Z(() => y.user, (u) => {
    if (!u)
      return G.push("/login");
    Object.assign(w.value, ve(u, ["id", "name", "token", "expiredAt"]));
    const p = G.currentRoute.value.redirectedFrom;
    p && !p.path.startsWith("/login") ? G.push(p) : G.push("/profile");
  }, { immediate: !0 }), Z(() => y.refreshToken, (u) => {
    u && (w.value.refreshToken = u);
  });
  let o = null;
  function e() {
    o && clearInterval(o), o = setInterval(() => {
      if (y.user) {
        const u = O("user/heartbeat");
        u && u.catch(() => {
        });
      }
    }, 60 * 1e3);
  }
  function v() {
    o && (clearInterval(o), o = null);
  }
  Z(() => y.user, (u) => {
    u ? e() : v();
  }, { immediate: !0 }), l.on("dispose", () => v());
};
export {
  vn as default
};

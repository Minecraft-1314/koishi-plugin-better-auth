import { useStorage as ae, send as V, message as z, store as c, Schema as j, icons as M, router as L, pick as re } from "@koishijs/client";
import { ref as k, defineComponent as b, onMounted as ue, nextTick as ce, resolveComponent as _, openBlock as m, createElementBlock as w, createElementVNode as t, createVNode as r, unref as I, withCtx as g, withKeys as de, withModifiers as ve, isRef as fe, createTextVNode as H, Transition as me, toDisplayString as C, createCommentVNode as U, normalizeClass as q, createBlock as O, computed as B, TransitionGroup as he, Fragment as pe, renderList as ge, watch as N } from "vue";
const v = ae("auth", 3, () => ({})), S = k("");
k(!1);
function _e() {
  const s = document.createElement("canvas"), i = s.getContext("2d");
  let e = "";
  return i && (i.textBaseline = "top", i.font = "14px Arial", i.fillText("auth-fingerprint", 2, 2), e = s.toDataURL()), [
    navigator.userAgent,
    navigator.language,
    (screen == null ? void 0 : screen.width) ?? 0,
    (screen == null ? void 0 : screen.height) ?? 0,
    (screen == null ? void 0 : screen.colorDepth) ?? 0,
    (/* @__PURE__ */ new Date()).getTimezoneOffset(),
    e
  ].join("||");
}
const ke = { class: "login-form" }, we = { class: "form-item" }, Ce = { class: "form-item" }, be = { class: "options" }, ye = { class: "control" }, ze = ["disabled"], xe = { class: "btn-text" }, $e = /* @__PURE__ */ b({
  __name: "login-form",
  setup(s) {
    const i = k(), e = k(!1), u = k(!1), a = k(!0), d = k();
    async function x() {
      if (u.value) return;
      const h = v.value.name, l = S.value;
      if (!h || !l) {
        i.value = "请输入用户名和密码";
        return;
      }
      u.value = !0, i.value = void 0;
      try {
        const f = _e();
        await V("login/password", h, l, a.value, f), v.value.name = h, a.value || (v.value.refreshToken = void 0), z.success(`欢迎回来，${h}！`);
      } catch (f) {
        i.value = (f == null ? void 0 : f.message) || "登录失败，请检查用户名和密码";
      } finally {
        u.value = !1;
      }
    }
    return ue(() => {
      ce(() => {
        var h;
        (h = d.value) == null || h.focus();
      });
    }), (h, l) => {
      const f = _("k-icon"), T = _("el-input"), P = _("el-checkbox");
      return m(), w("div", ke, [
        t("div", we, [
          l[6] || (l[6] = t("label", null, "用户名", -1)),
          r(T, {
            ref_key: "nameInputRef",
            ref: d,
            placeholder: "请输入用户名",
            modelValue: I(v).name,
            "onUpdate:modelValue": l[0] || (l[0] = (y) => I(v).name = y),
            onInput: l[1] || (l[1] = (y) => i.value = void 0)
          }, {
            prefix: g(() => [
              r(f, { name: "user" })
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]),
        t("div", Ce, [
          l[7] || (l[7] = t("label", null, "密码", -1)),
          r(T, {
            placeholder: "请输入密码",
            modelValue: I(S),
            "onUpdate:modelValue": l[3] || (l[3] = (y) => fe(S) ? S.value = y : null),
            type: e.value ? "text" : "password",
            onKeyup: de(ve(x, ["stop"]), ["enter"]),
            onInput: l[4] || (l[4] = (y) => i.value = void 0)
          }, {
            prefix: g(() => [
              r(f, { name: "lock" })
            ]),
            suffix: g(() => [
              t("span", {
                class: "password-toggle",
                onClick: l[2] || (l[2] = (y) => e.value = !e.value)
              }, [
                r(f, {
                  name: e.value ? "eye" : "eye-slash"
                }, null, 8, ["name"])
              ])
            ]),
            _: 1
          }, 8, ["modelValue", "type", "onKeyup"])
        ]),
        t("div", be, [
          r(P, {
            modelValue: a.value,
            "onUpdate:modelValue": l[5] || (l[5] = (y) => a.value = y)
          }, {
            default: g(() => [...l[8] || (l[8] = [
              H("记住我", -1)
            ])]),
            _: 1
          }, 8, ["modelValue"])
        ]),
        r(me, { name: "error" }, {
          default: g(() => [
            i.value ? (m(), w("p", {
              class: "error",
              key: i.value
            }, C(i.value), 1)) : U("", !0)
          ]),
          _: 1
        }),
        t("div", ye, [
          t("button", {
            class: "btn btn-primary",
            disabled: u.value,
            onClick: x
          }, [
            t("span", {
              class: q(["btn-icon", { loading: u.value }])
            }, null, 2),
            t("span", xe, C(u.value ? "登录中…" : "登录"), 1)
          ], 8, ze)
        ])
      ]);
    };
  }
}), R = (s, i) => {
  const e = s.__vccOpts || s;
  for (const [u, a] of i)
    e[u] = a;
  return e;
}, Ve = /* @__PURE__ */ R($e, [["__scopeId", "data-v-78dcc580"]]), Me = { class: "login-page" }, He = { class: "login-container" }, Te = { class: "login-brand" }, Le = { class: "brand-icon" }, Se = /* @__PURE__ */ b({
  __name: "login",
  setup(s) {
    return (i, e) => {
      const u = _("k-icon"), a = _("k-card"), d = _("k-layout");
      return m(), O(d, { main: "darker" }, {
        default: g(() => [
          t("div", Me, [
            e[3] || (e[3] = t("div", { class: "login-bg" }, [
              t("div", { class: "blob blob-1" }),
              t("div", { class: "blob blob-2" }),
              t("div", { class: "blob blob-3" })
            ], -1)),
            t("div", He, [
              r(a, { class: "login-card" }, {
                default: g(() => [
                  t("div", Te, [
                    t("div", Le, [
                      r(u, { name: "user-full" })
                    ]),
                    e[0] || (e[0] = t("h1", null, "欢迎回来", -1)),
                    e[1] || (e[1] = t("p", null, "登录 Koishi 控制台以继续", -1))
                  ]),
                  r(Ve)
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
}), Ae = /* @__PURE__ */ R(Se, [["__scopeId", "data-v-95fb7039"]]), Be = { class: "user-header" }, Ie = { class: "user-avatar" }, Ue = { class: "user-info" }, Pe = { class: "section-card" }, De = { class: "section-title" }, je = { class: "section-card" }, Ne = { class: "section-title" }, Oe = {
  key: 0,
  class: "count-badge"
}, Re = { class: "token-check" }, Fe = { class: "token-device" }, Ke = { class: "token-meta" }, Ee = { class: "token-top" }, qe = { class: "token-time" }, We = { class: "token-detail" }, Ge = { class: "detail-item" }, Je = { class: "detail-item" }, Qe = { class: "detail-item detail-ua" }, Xe = { class: "token-actions" }, Ye = {
  key: 1,
  class: "batch-actions"
}, Ze = /* @__PURE__ */ b({
  __name: "profile",
  setup(s) {
    const i = {
      password: "密码登录",
      token: "自动登录"
    }, e = k({}), u = k(!1), a = k(!1), d = k(null), x = k(!1), h = k(!1), l = k([]), f = B(() => {
      var n;
      return ((n = c.user) == null ? void 0 : n.tokens) ?? [];
    }), T = B(() => f.value.length > 0 && f.value.every((n) => l.value.includes(n.inc))), P = B(() => j.object({
      name: j.string().description("用户名").default(v.value.name),
      password: j.string().role("secret").description("密码").default(S.value)
    }).description("基本资料"));
    async function y() {
      const n = {};
      for (const o of Object.keys(e.value))
        e.value[o] !== void 0 && (n[o] = e.value[o]);
      if (!(!Object.keys(n).length || u.value)) {
        u.value = !0;
        try {
          await V("user/update", n), z.success("修改成功！"), n.name !== void 0 && (v.value.name = n.name, c.user && (c.user.name = n.name)), e.value = {};
        } catch (o) {
          z.error((o == null ? void 0 : o.message) || "修改失败");
        } finally {
          u.value = !1;
        }
      }
    }
    async function W() {
      if (!a.value) {
        a.value = !0;
        try {
          await V("user/logout"), c.user = null, v.value.id = void 0, v.value.token = void 0, v.value.expiredAt = void 0, v.value.refreshToken = void 0;
        } catch (n) {
          z.error((n == null ? void 0 : n.message) || "退出登录失败");
        } finally {
          a.value = !1;
        }
      }
    }
    async function G(n) {
      if (d.value === null) {
        d.value = n;
        try {
          await V("user/delete-token", n), z.success("会话已移除"), c.user && (c.user.tokens = c.user.tokens.filter((o) => o.inc !== n)), l.value = l.value.filter((o) => o !== n);
        } catch (o) {
          z.error((o == null ? void 0 : o.message) || "移除会话失败");
        } finally {
          d.value = null;
        }
      }
    }
    async function J() {
      if (!(!l.value.length || x.value)) {
        x.value = !0;
        try {
          await V("user/delete-tokens", l.value), z.success("已批量移除会话"), c.user && (c.user.tokens = c.user.tokens.filter((n) => !l.value.includes(n.inc))), l.value = [];
        } catch (n) {
          z.error((n == null ? void 0 : n.message) || "批量移除失败");
        } finally {
          x.value = !1;
        }
      }
    }
    function Q() {
      T.value ? l.value = [] : l.value = f.value.map((n) => n.inc);
    }
    function F(n) {
      const o = new Date(n);
      return Number.isNaN(o.getTime()) ? String(n) : o.toLocaleString();
    }
    function X(n) {
      return /Mobile|Android|iPhone|iPad|iPod/i.test(n);
    }
    function Y(n) {
      if (!n) return "未知";
      if (n.includes(":")) {
        const $ = n.split(":");
        return `${$.slice(0, Math.max(1, $.length - 2)).join(":")}:**`;
      }
      const o = n.split(".");
      return o.length === 4 ? `${o[0]}.${o[1]}.**.**` : n;
    }
    function Z(n) {
      return n ? n.replace(/^Mozilla\/5\.0 \(([^;]+); ([^;]+); ([^)]+)\).*$/, "$1 $2") : "未知";
    }
    const ee = B(() => [{
      icon: "check",
      label: "应用更改",
      disabled: !Object.keys(e.value).length || u.value,
      action: y
    }, {
      type: "danger",
      icon: "sign-out",
      label: "退出登录",
      disabled: a.value,
      action: W
    }]);
    return (n, o) => {
      const $ = _("k-icon"), te = _("k-form"), se = _("el-checkbox"), ne = _("el-checkbox-group"), A = _("el-button"), oe = _("el-empty"), le = _("k-content"), ie = _("k-layout");
      return m(), O(ie, {
        main: "page-profile",
        menu: ee.value
      }, {
        default: g(() => [
          r(le, null, {
            default: g(() => {
              var K;
              return [
                t("div", Be, [
                  t("div", Ie, [
                    r($, { name: "user-full" })
                  ]),
                  t("div", Ue, [
                    t("h1", null, C(((K = I(c).user) == null ? void 0 : K.name) || "用户资料"), 1),
                    o[3] || (o[3] = t("p", null, "管理你的个人资料与登录会话", -1))
                  ]),
                  o[4] || (o[4] = t("div", { class: "user-status" }, [
                    t("span", { class: "status-dot" }),
                    t("span", null, "已登录")
                  ], -1))
                ]),
                t("div", Pe, [
                  t("div", De, [
                    r($, { name: "edit" }),
                    o[5] || (o[5] = t("span", null, "基本资料", -1))
                  ]),
                  r(te, {
                    schema: P.value,
                    modelValue: e.value,
                    "onUpdate:modelValue": o[0] || (o[0] = (p) => e.value = p)
                  }, null, 8, ["schema", "modelValue"])
                ]),
                t("div", je, [
                  t("div", Ne, [
                    r($, { name: "clock" }),
                    o[6] || (o[6] = t("span", null, "登录历史", -1)),
                    f.value.length ? (m(), w("span", Oe, C(f.value.length), 1)) : U("", !0)
                  ]),
                  r(he, {
                    name: "token",
                    tag: "div",
                    class: "token-list"
                  }, {
                    default: g(() => [
                      (m(!0), w(pe, null, ge(f.value, (p) => (m(), w("div", {
                        class: "token-item",
                        key: p.inc
                      }, [
                        t("div", Re, [
                          r(ne, {
                            modelValue: l.value,
                            "onUpdate:modelValue": o[1] || (o[1] = (D) => l.value = D)
                          }, {
                            default: g(() => [
                              r(se, {
                                value: p.inc
                              }, null, 8, ["value"])
                            ]),
                            _: 2
                          }, 1032, ["modelValue"])
                        ]),
                        t("div", Fe, [
                          r($, {
                            name: X(p.userAgent) ? "mobile" : "desktop"
                          }, null, 8, ["name"])
                        ]),
                        t("div", Ke, [
                          t("div", Ee, [
                            t("span", {
                              class: q(["type-tag", p.type])
                            }, C(i[p.type] || p.type), 3),
                            t("span", qe, "登录于 " + C(F(p.createdAt)), 1)
                          ]),
                          t("div", We, [
                            t("span", Ge, [
                              r($, { name: "clock" }),
                              H(" 最后访问 " + C(F(p.lastUsedAt)), 1)
                            ]),
                            t("span", Je, [
                              o[7] || (o[7] = t("span", { class: "detail-label" }, "IP", -1)),
                              H(" " + C(h.value ? p.address : Y(p.address)) + " ", 1),
                              r(A, {
                                class: "action-btn ip-btn",
                                size: "small",
                                text: "",
                                onClick: o[2] || (o[2] = (D) => h.value = !h.value)
                              }, {
                                default: g(() => [
                                  H(C(h.value ? "隐藏" : "显示"), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            t("span", Qe, C(Z(p.userAgent)), 1)
                          ])
                        ]),
                        t("div", Xe, [
                          r(A, {
                            class: "action-btn remove-btn",
                            size: "small",
                            loading: d.value === p.inc,
                            onClick: (D) => G(p.inc)
                          }, {
                            default: g(() => [...o[8] || (o[8] = [
                              H("移除会话", -1)
                            ])]),
                            _: 1
                          }, 8, ["loading", "onClick"])
                        ])
                      ]))), 128))
                    ]),
                    _: 1
                  }),
                  f.value.length ? U("", !0) : (m(), O(oe, {
                    key: 0,
                    description: "暂无登录历史"
                  })),
                  f.value.length ? (m(), w("div", Ye, [
                    r(A, {
                      class: "action-btn select-btn",
                      size: "small",
                      onClick: Q
                    }, {
                      default: g(() => [
                        H(C(T.value ? "取消全选" : "全选"), 1)
                      ]),
                      _: 1
                    }),
                    r(A, {
                      class: "action-btn danger-btn",
                      size: "small",
                      loading: x.value,
                      disabled: !l.value.length,
                      onClick: J
                    }, {
                      default: g(() => [
                        H("批量移除 (" + C(l.value.length) + ")", 1)
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ])) : U("", !0)
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
}), et = /* @__PURE__ */ R(Ze, [["__scopeId", "data-v-50905785"]]), tt = ["width", "height", "fill"], st = /* @__PURE__ */ b({
  __name: "check",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(s) {
    return (i, e) => (m(), w("svg", {
      class: "k-icon check",
      width: s.size,
      height: s.size,
      fill: s.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 448 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z" }, null, -1)
    ])], 8, tt));
  }
}), nt = ["width", "height", "fill"], ot = /* @__PURE__ */ b({
  __name: "clock",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(s) {
    return (i, e) => (m(), w("svg", {
      class: "k-icon k-icon-clock",
      width: s.size,
      height: s.size,
      fill: s.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.3 275.1L330.3 339.1C338.2 345.3 348.5 343.3 354.8 335.4C361.1 327.4 359.1 317.2 351.2 310.9L264.1 247.1C264 247.4 264 246.8 264 246.8V128C264 113.1 254 104 240 104C226 104 216 113.1 216 128V256z" }, null, -1)
    ])], 8, nt));
  }
}), lt = ["width", "height", "fill"], it = /* @__PURE__ */ b({
  __name: "desktop",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(s) {
    return (i, e) => (m(), w("svg", {
      class: "k-icon k-icon-desktop",
      width: s.size,
      height: s.size,
      fill: s.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 576 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h192l-16 48h-72c-13.25 0-24 10.75-24 24s10.75 24 24 24h272c13.25 0 24-10.75 24-24s-10.75-24-24-24h-72l-16-48h192c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-16 352H64V64h448v288z" }, null, -1)
    ])], 8, lt));
  }
}), at = ["width", "height", "fill"], rt = /* @__PURE__ */ b({
  __name: "lock",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(s) {
    return (i, e) => (m(), w("svg", {
      class: "k-icon k-icon-lock",
      width: s.size,
      height: s.size,
      fill: s.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 448 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z" }, null, -1)
    ])], 8, at));
  }
}), ut = ["width", "height", "fill"], ct = /* @__PURE__ */ b({
  __name: "mobile",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(s) {
    return (i, e) => (m(), w("svg", {
      class: "k-icon k-icon-mobile",
      width: s.size,
      height: s.size,
      fill: s.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 384 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M16 64C16 28.65 44.65 0 80 0H304C339.3 0 368 28.65 368 64V448C368 483.3 339.3 512 304 512H80C44.65 512 16 483.3 16 448V64zM224 448C224 434.7 213.3 424 200 424C186.7 424 176 434.7 176 448C176 461.3 186.7 472 200 472C213.3 472 224 461.3 224 448zM112 64V96H272V64H112z" }, null, -1)
    ])], 8, ut));
  }
}), dt = ["width", "height", "fill"], vt = /* @__PURE__ */ b({
  __name: "sign-in",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(s) {
    return (i, e) => (m(), w("svg", {
      class: "k-icon k-icon-sign-in",
      width: s.size,
      height: s.size,
      fill: s.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M384 256c0-8.188-3.125-16.38-9.375-22.62l-128-128C237.5 96.22 223.7 93.47 211.8 98.44C199.8 103.4 192 115.1 192 128v64H48C21.49 192 0 213.5 0 240v32C0 298.5 21.49 320 48 320H192v64c0 12.94 7.797 24.62 19.75 29.56c11.97 4.969 25.72 2.219 34.88-6.938l128-128C380.9 272.4 384 264.2 384 256zM224 384V288H48C39.18 288 32 280.8 32 272v-32C32 231.2 39.18 224 48 224H224L223.1 128l128 128L224 384zM432 32h-96C327.2 32 320 39.16 320 48S327.2 64 336 64h96C458.5 64 480 85.53 480 112v288c0 26.47-21.53 48-48 48h-96c-8.844 0-16 7.156-16 16s7.156 16 16 16h96c44.13 0 80-35.88 80-80v-288C512 67.88 476.1 32 432 32z" }, null, -1)
    ])], 8, dt));
  }
}), ft = ["width", "height", "fill"], mt = /* @__PURE__ */ b({
  __name: "sign-out",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(s) {
    return (i, e) => (m(), w("svg", {
      class: "k-icon k-icon-sign-out",
      width: s.size,
      height: s.size,
      fill: s.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M176 448h-96C53.53 448 32 426.5 32 400v-288C32 85.53 53.53 64 80 64h96C184.8 64 192 56.84 192 48S184.8 32 176 32h-96C35.88 32 0 67.88 0 112v288C0 444.1 35.88 480 80 480h96C184.8 480 192 472.8 192 464S184.8 448 176 448zM502.6 233.4l-128-128c-9.156-9.156-22.91-11.91-34.88-6.938C327.8 103.4 320 115.1 320 128l.0918 63.1L176 192C149.5 192 128 213.5 128 240v32C128 298.5 149.5 320 176 320l144.1-.001L320 384c0 12.94 7.797 24.62 19.75 29.56c11.97 4.969 25.72 2.219 34.88-6.938l128-128C508.9 272.4 512 264.2 512 256S508.9 239.6 502.6 233.4zM352 384V288H176C167.2 288 160 280.8 160 272v-32C160 231.2 167.2 224 176 224H352l-.0039-96l128 128L352 384z" }, null, -1)
    ])], 8, ft));
  }
}), ht = ["width", "height", "fill"], pt = /* @__PURE__ */ b({
  __name: "user-full",
  props: {
    size: { default: 24 },
    color: { default: "currentColor" }
  },
  setup(s) {
    return (i, e) => (m(), w("svg", {
      class: "k-icon",
      width: s.size,
      height: s.size,
      fill: s.color,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512"
    }, [...e[0] || (e[0] = [
      t("path", { d: "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 480c-47.24 0-91.04-14.78-127.2-39.84C132.9 390.9 173.8 352 224 352h64c50.25 0 91.14 38.94 95.21 88.16C347 465.2 303.2 480 256 480zM411.7 416.7C397.6 361.3 347.7 320 288 320H224c-59.73 0-109.6 41.3-123.7 96.72C58.27 375.1 32 319 32 256c0-123.5 100.5-224 224-224s224 100.5 224 224C480 319 453.7 375.1 411.7 416.7zM256 128C211.8 128 176 163.8 176 208C176 252.2 211.8 288 256 288s80-35.82 80-80C336 163.8 300.2 128 256 128zM256 256C229.5 256 208 234.5 208 208S229.5 160 256 160s48 21.53 48 48S282.5 256 256 256z" }, null, -1)
    ])], 8, ht));
  }
});
M.register("check", st);
M.register("clock", ot);
M.register("desktop", it);
M.register("lock", rt);
M.register("mobile", ct);
M.register("sign-in", vt);
M.register("sign-out", mt);
M.register("user-full", pt);
function E() {
  v.value.id = void 0, v.value.name = void 0, v.value.token = void 0, v.value.expiredAt = void 0, v.value.refreshToken = void 0;
}
async function gt() {
  const { id: s, token: i, expiredAt: e, refreshToken: u } = v.value;
  if (s && i && e && e > Date.now()) {
    try {
      await V("login/token", s, i);
    } catch {
      E();
    }
    return;
  }
  if (u)
    try {
      await V("login/refresh", u);
    } catch {
      E();
    }
}
const wt = (s) => {
  gt(), s.on("activity", (a) => a.authority > 0 && (!c.user || c.user.authority < a.authority)), s.scope.disposables.push(L.beforeEach((a) => {
    var h, l;
    const { activity: d } = a.meta;
    if (!d) return;
    if ((d.authority > 0 || ((h = d.fields) == null ? void 0 : h.includes("user"))) && !c.user)
      return a.path === "/login" ? void 0 : "/login";
    if (d.authority && d.authority > (((l = c.user) == null ? void 0 : l.authority) ?? 0))
      return z.error("权限不足。"), !1;
    if (c.user && a.path === "/login")
      return "/profile";
  })), s.page({
    path: "/login",
    name: "登录",
    icon: "sign-in",
    position: "bottom",
    order: 500,
    disabled: () => !!c.user,
    component: Ae
  }), s.page({
    path: "/profile",
    name: "用户资料",
    icon: "user-full",
    fields: ["user"],
    position: "bottom",
    order: 500,
    component: et
  }), N(() => c.user, (a) => {
    if (!a)
      return L.push("/login");
    Object.assign(v.value, re(a, ["id", "name", "token", "expiredAt"]));
    const d = L.currentRoute.value.redirectedFrom;
    d && !d.path.startsWith("/login") ? L.push(d) : L.push("/profile");
  }, { immediate: !0 }), N(() => c.refreshToken, (a) => {
    a && (v.value.refreshToken = a);
  });
  let i = null;
  function e() {
    i && clearInterval(i), i = setInterval(() => {
      if (c.user) {
        const a = V("user/heartbeat");
        a && a.catch(() => {
        });
      }
    }, 60 * 1e3);
  }
  function u() {
    i && (clearInterval(i), i = null);
  }
  N(() => c.user, (a) => {
    a ? e() : u();
  }, { immediate: !0 }), s.on("dispose", () => u());
};
export {
  wt as default
};

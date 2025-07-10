import { defineComponent as W, ref as x, reactive as de, computed as O, watch as Ge, createElementBlock as c, openBlock as p, normalizeStyle as j, normalizeClass as Y, withDirectives as F, createCommentVNode as H, toDisplayString as D, createElementVNode as e, Fragment as I, renderList as P, vModelText as Q, createTextVNode as k, vShow as pe, withKeys as Ve, withModifiers as Ye, createStaticVNode as re, onMounted as We, nextTick as Ke, createVNode as ie, vModelSelect as Xe, createBlock as ce } from "vue";
const Je = ["src", "alt"], qe = ["onMousedown"], je = {
  key: 3,
  class: "image-placeholder-element"
}, Qe = { class: "image-size-controls" }, Ze = {
  key: 6,
  class: "table-element"
}, _e = ["onClick", "onInput"], et = ["onMousedown"], tt = ["onMousedown"], nt = ["onMousedown"], ot = ["onMousedown"], lt = /* @__PURE__ */ W({
  __name: "CanvasElement",
  props: {
    element: {},
    selected: { type: Boolean }
  },
  emits: ["select", "delete", "update"],
  setup(M, { emit: f }) {
    const o = M, d = f, b = x(!1), g = x(!1), a = x(o.element.content), l = x(o.element.dimensions?.width || 120), m = x(o.element.dimensions?.height || 150), C = de({
      rows: [
        [
          { id: "cell-0-0", content: "Cell 1,1", styles: {} },
          { id: "cell-0-1", content: "Cell 1,2", styles: {} }
        ],
        [
          { id: "cell-1-0", content: "Cell 2,1", styles: {} },
          { id: "cell-1-1", content: "Cell 2,2", styles: {} }
        ]
      ]
    }), R = O(() => [
      "canvas-element",
      {
        selected: o.selected,
        editing: b.value,
        dragging: g.value
      }
    ]), S = O(() => ({
      left: `${o.element.position.x}px`,
      top: `${o.element.position.y}px`,
      width: o.element.dimensions?.width ? `${o.element.dimensions.width}px` : "auto",
      height: o.element.dimensions?.height ? `${o.element.dimensions.height}px` : "auto",
      ...o.element.styles
    })), T = O(() => ({
      width: "100%",
      height: "100%",
      objectFit: "contain"
    })), y = O(() => o.element.type === "horizontal-line" ? {
      width: `${o.element.dimensions?.width || 200}px`,
      height: `${o.element.dimensions?.height || 2}px`,
      backgroundColor: "#333"
    } : o.element.type === "vertical-line" ? {
      width: `${o.element.dimensions?.width || 2}px`,
      height: `${o.element.dimensions?.height || 100}px`,
      backgroundColor: "#333"
    } : {}), r = (i) => {
      i.stopPropagation(), d("select", o.element.id, i.ctrlKey || i.metaKey);
    }, w = (i) => {
      i.target instanceof HTMLElement && (i.target.classList.contains("resize-handle") || i.target.classList.contains("text-editable") || i.target.classList.contains("placeholder-element") || i.target.tagName === "INPUT" || i.target.tagName === "BUTTON" || i.target.contentEditable === "true") || (g.value = !0);
    }, A = (i) => {
      b.value = !1;
      const u = i.target, v = u.textContent || "";
      v.trim() === "" && (u.textContent = "Click to edit text..."), d("update", o.element.id, { content: v });
    }, X = (i) => {
      const u = i.target;
      d("update", o.element.id, { content: u.textContent || "" });
    }, h = () => {
      d("update", o.element.id, { content: a.value });
    }, V = () => {
      d("update", o.element.id, {
        dimensions: {
          width: l.value,
          height: m.value
        }
      });
    }, ne = (i, u) => {
      C.selectedCell = { row: i, col: u };
    }, z = (i, u, v) => {
      const E = v.target;
      C.rows[i][u].content = E.textContent || "";
    }, Z = (i, u) => {
      i.preventDefault(), i.stopPropagation();
    }, oe = (i, u) => {
      i.preventDefault(), i.stopPropagation();
    }, _ = (i, u, v) => {
      i.preventDefault(), i.stopPropagation();
    }, le = (i, u, v) => {
      i.preventDefault(), i.stopPropagation();
    }, ae = (i, u, v) => {
      i.preventDefault(), i.stopPropagation();
    };
    return Ge(() => o.element.content, (i) => {
      o.element.type === "placeholder" && (a.value = i);
    }), (i, u) => (p(), c("div", {
      class: Y(R.value),
      style: j(S.value),
      onClick: r,
      onMousedown: w
    }, [
      i.element.type === "text" ? (p(), c("div", {
        key: 0,
        class: "text-editable",
        contenteditable: "",
        onFocus: u[0] || (u[0] = (v) => b.value = !0),
        onBlur: A,
        onInput: X
      }, D(i.element.content), 33)) : i.element.type === "image" ? (p(), c("div", {
        key: 1,
        class: Y(["image-container", { selected: i.selected }])
      }, [
        e("img", {
          src: i.element.content,
          alt: i.element.content,
          class: "image-element",
          style: j(T.value)
        }, null, 12, Je),
        (p(), c(I, null, P(["nw", "ne", "sw", "se"], (v) => e("div", {
          key: v,
          class: Y(`image-resize-handle ${v}`),
          onMousedown: (E) => oe(E)
        }, null, 42, qe)), 64))
      ], 2)) : i.element.type === "placeholder" ? F((p(), c("input", {
        key: 2,
        "onUpdate:modelValue": u[1] || (u[1] = (v) => a.value = v),
        class: "placeholder-element",
        type: "text",
        onFocus: u[2] || (u[2] = (v) => b.value = !0),
        onBlur: u[3] || (u[3] = (v) => b.value = !1),
        onInput: h
      }, null, 544)), [
        [Q, a.value]
      ]) : i.element.type === "image-placeholder" ? (p(), c("div", je, [
        k(D(i.element.content) + " ", 1),
        e("div", Qe, [
          u[7] || (u[7] = e("span", null, "Size:", -1)),
          F(e("input", {
            type: "number",
            "onUpdate:modelValue": u[4] || (u[4] = (v) => l.value = v),
            min: "50",
            max: "500",
            onChange: V
          }, null, 544), [
            [
              Q,
              l.value,
              void 0,
              { number: !0 }
            ]
          ]),
          u[8] || (u[8] = e("span", null, "x", -1)),
          F(e("input", {
            type: "number",
            "onUpdate:modelValue": u[5] || (u[5] = (v) => m.value = v),
            min: "50",
            max: "500",
            onChange: V
          }, null, 544), [
            [
              Q,
              m.value,
              void 0,
              { number: !0 }
            ]
          ]),
          u[9] || (u[9] = e("span", null, "px", -1))
        ])
      ])) : i.element.type === "horizontal-line" ? (p(), c("div", {
        key: 4,
        class: "horizontal-line-element",
        style: j(y.value)
      }, null, 4)) : i.element.type === "vertical-line" ? (p(), c("div", {
        key: 5,
        class: "vertical-line-element",
        style: j(y.value)
      }, null, 4)) : i.element.type === "table" ? (p(), c("table", Ze, [
        (p(!0), c(I, null, P(C.rows, (v, E) => (p(), c("tr", { key: E }, [
          (p(!0), c(I, null, P(v, (se, B) => (p(), c("td", {
            key: B,
            contenteditable: "",
            class: Y({ "selected-cell": C.selectedCell?.row === E && C.selectedCell?.col === B }),
            onClick: (L) => ne(E, B),
            onInput: (L) => z(E, B, L)
          }, [
            k(D(se.content) + " ", 1),
            B < v.length - 1 ? (p(), c("div", {
              key: 0,
              class: "table-cell-resize-handle width-handle",
              onMousedown: (L) => _(L)
            }, null, 40, et)) : H("", !0),
            E < C.rows.length - 1 ? (p(), c("div", {
              key: 1,
              class: "table-cell-resize-handle height-handle",
              onMousedown: (L) => le(L)
            }, null, 40, tt)) : H("", !0),
            B < v.length - 1 && E < C.rows.length - 1 ? (p(), c("div", {
              key: 2,
              class: "table-cell-resize-handle corner-handle",
              onMousedown: (L) => ae(L)
            }, null, 40, nt)) : H("", !0)
          ], 42, _e))), 128))
        ]))), 128))
      ])) : H("", !0),
      F(e("button", {
        class: "delete-btn",
        onClick: u[6] || (u[6] = (v) => i.$emit("delete", i.element.id))
      }, " × ", 512), [
        [pe, i.selected]
      ]),
      (p(), c(I, null, P(["nw", "ne", "sw", "se"], (v) => F(e("div", {
        key: v,
        class: Y(`resize-handle resize-${v}`),
        onMousedown: (E) => Z(E)
      }, null, 42, ot), [
        [pe, i.selected && i.element.type !== "image"]
      ])), 64))
    ], 38));
  }
}), K = (M, f) => {
  const o = M.__vccOpts || M;
  for (const [d, b] of f)
    o[d] = b;
  return o;
}, at = /* @__PURE__ */ K(lt, [["__scopeId", "data-v-4b5f483d"]]), st = { class: "group-label" }, it = /* @__PURE__ */ W({
  __name: "GroupContainer",
  props: {
    group: {},
    visible: { type: Boolean }
  },
  emits: ["select", "move"],
  setup(M, { emit: f }) {
    const o = M, d = f, b = O(() => [
      "group-container"
    ]), g = O(() => ({
      left: `${o.group.position.x}px`,
      top: `${o.group.position.y}px`,
      width: `${o.group.dimensions.width}px`,
      height: `${o.group.dimensions.height}px`
    })), a = (l) => {
      if (l.target instanceof HTMLElement && l.target.classList.contains("group-label"))
        return;
      l.preventDefault(), l.stopPropagation();
      const m = l.clientX, G = l.clientY, C = o.group.position.x, R = o.group.position.y, S = (y) => {
        const r = y.clientX - m, w = y.clientY - G, A = {
          x: Math.max(0, C + r),
          y: Math.max(0, R + w)
        };
        d("move", o.group.id, A);
      }, T = () => {
        document.removeEventListener("mousemove", S), document.removeEventListener("mouseup", T);
      };
      document.addEventListener("mousemove", S), document.addEventListener("mouseup", T);
    };
    return (l, m) => l.visible ? (p(), c("div", {
      key: 0,
      class: Y(b.value),
      style: j(g.value),
      onClick: m[0] || (m[0] = (G) => l.$emit("select", l.group.id)),
      onMousedown: a
    }, [
      e("div", st, D(l.group.id.replace("group_", "Group ")), 1)
    ], 38)) : H("", !0);
  }
}), dt = /* @__PURE__ */ K(it, [["__scopeId", "data-v-51dcee29"]]), rt = { class: "placeholders-panel" }, ut = { class: "add-text-form" }, pt = { class: "placeholder-category" }, ct = { class: "placeholder-grid" }, mt = ["onDragstart"], gt = { class: "placeholder-category" }, vt = { class: "placeholder-grid" }, yt = ["onDragstart"], ht = { class: "placeholder-category" }, ft = { class: "placeholder-grid" }, bt = ["onDragstart"], Ct = { class: "placeholder-category" }, $t = { class: "placeholder-grid" }, kt = ["onDragstart"], wt = { class: "placeholder-category" }, xt = { class: "placeholder-grid" }, Dt = ["onDragstart"], Tt = { class: "placeholder-category" }, Et = { class: "placeholder-grid" }, Mt = ["onDragstart"], Rt = /* @__PURE__ */ W({
  __name: "PlaceholdersPanel",
  emits: ["drag-start", "add-custom-text"],
  setup(M, { emit: f }) {
    const o = f, d = x(""), b = [
      { type: "placeholder", content: "{employee_name}", icon: "👤", label: "Employee Name" },
      { type: "placeholder", content: "{employee_id}", icon: "🆔", label: "Employee ID" },
      { type: "placeholder", content: "{position}", icon: "💼", label: "Position" },
      { type: "placeholder", content: "{department}", icon: "🏢", label: "Department" },
      { type: "placeholder", content: "{start_date}", icon: "📅", label: "Start Date" },
      { type: "placeholder", content: "{email}", icon: "📧", label: "Email" },
      { type: "placeholder", content: "{phone}", icon: "📞", label: "Phone" },
      { type: "placeholder", content: "{address}", icon: "🏠", label: "Address" }
    ], g = [
      { type: "placeholder", content: "{salary}", icon: "💰", label: "Salary" },
      { type: "placeholder", content: "{hourly_rate}", icon: "⏰", label: "Hourly Rate" },
      { type: "placeholder", content: "{bonus}", icon: "🎁", label: "Bonus" },
      { type: "placeholder", content: "{benefits}", icon: "🏥", label: "Benefits" },
      { type: "placeholder", content: "{vacation_days}", icon: "🌴", label: "Vacation Days" },
      { type: "placeholder", content: "{sick_days}", icon: "🏥", label: "Sick Days" }
    ], a = [
      { type: "placeholder", content: "{company_name}", icon: "🏢", label: "Company Name" },
      { type: "placeholder", content: "{company_address}", icon: "📍", label: "Company Address" },
      { type: "placeholder", content: "{hr_contact}", icon: "👥", label: "HR Contact" },
      { type: "placeholder", content: "{manager_name}", icon: "👨‍💼", label: "Manager Name" },
      { type: "placeholder", content: "{company_phone}", icon: "📞", label: "Company Phone" },
      { type: "placeholder", content: "{company_email}", icon: "📧", label: "Company Email" }
    ], l = [
      { type: "placeholder", content: "{review_date}", icon: "📅", label: "Review Date" },
      { type: "placeholder", content: "{next_review}", icon: "⏭️", label: "Next Review" },
      { type: "placeholder", content: "{performance_rating}", icon: "⭐", label: "Performance Rating" },
      { type: "placeholder", content: "{goals}", icon: "🎯", label: "Goals" },
      { type: "placeholder", content: "{training_completed}", icon: "🎓", label: "Training Completed" },
      { type: "placeholder", content: "{certifications}", icon: "📜", label: "Certifications" }
    ], m = [
      { type: "image-placeholder", content: "{{employee_image}}", icon: "👤", label: "{{employee_image}}" },
      { type: "image-placeholder", content: "{{company_logo}}", icon: "🏢", label: "{{company_logo}}" },
      { type: "image-placeholder", content: "{{signature_image}}", icon: "✍️", label: "{{signature_image}}" },
      { type: "image", content: "upload", icon: "📁", label: "Upload Image" },
      { type: "image", content: "url", icon: "🌐", label: "Image from URL" }
    ], G = [
      { type: "text", content: "EMPLOYEE RECORD", icon: "📄", label: '"EMPLOYEE RECORD" Title' },
      { type: "text", content: "PERFORMANCE REVIEW", icon: "📋", label: '"PERFORMANCE REVIEW" Title' },
      { type: "text", content: "JOB OFFER LETTER", icon: "💼", label: '"JOB OFFER LETTER" Title' },
      { type: "text", content: "EMPLOYEE HANDBOOK", icon: "📚", label: '"EMPLOYEE HANDBOOK" Title' },
      { type: "text", content: "Employee Details:", icon: "👤", label: '"Employee Details:" Label' },
      { type: "text", content: "Department:", icon: "🏢", label: '"Department:" Label' },
      { type: "text", content: "Salary:", icon: "💰", label: '"Salary:" Label' },
      { type: "text", content: "HR Manager:", icon: "👥", label: '"HR Manager:" Label' },
      { type: "text", content: "Date:", icon: "📅", label: '"Date:" Label' },
      { type: "text", content: "Signature:", icon: "✍️", label: '"Signature:" Label' }
    ], C = (T, y) => {
      T.target instanceof HTMLElement && T.target.classList.add("dragging"), T.dataTransfer.effectAllowed = "copy", o("drag-start", y);
    }, R = (T) => {
      T.target instanceof HTMLElement && T.target.classList.remove("dragging");
    }, S = () => {
      d.value.trim() && (o("add-custom-text", d.value.trim()), d.value = "");
    };
    return (T, y) => (p(), c("div", rt, [
      y[7] || (y[7] = e("h3", null, "🏷️ Drag to Canvas", -1)),
      e("div", ut, [
        F(e("input", {
          "onUpdate:modelValue": y[0] || (y[0] = (r) => d.value = r),
          type: "text",
          placeholder: "Type text to add...",
          onKeypress: Ve(S, ["enter"])
        }, null, 544), [
          [Q, d.value]
        ]),
        e("button", { onClick: S }, "Add")
      ]),
      e("div", pt, [
        y[1] || (y[1] = e("h4", null, "👤 Employee Information", -1)),
        e("div", ct, [
          (p(), c(I, null, P(b, (r) => e("div", {
            key: r.content,
            class: "placeholder-btn",
            draggable: "true",
            onDragstart: (w) => C(w, r),
            onDragend: R
          }, [
            e("span", null, D(r.icon), 1),
            k(" " + D(r.label), 1)
          ], 40, mt)), 64))
        ])
      ]),
      e("div", gt, [
        y[2] || (y[2] = e("h4", null, "💰 Salary & Benefits", -1)),
        e("div", vt, [
          (p(), c(I, null, P(g, (r) => e("div", {
            key: r.content,
            class: "placeholder-btn",
            draggable: "true",
            onDragstart: (w) => C(w, r),
            onDragend: R
          }, [
            e("span", null, D(r.icon), 1),
            k(" " + D(r.label), 1)
          ], 40, yt)), 64))
        ])
      ]),
      e("div", ht, [
        y[3] || (y[3] = e("h4", null, "🏢 Company Information", -1)),
        e("div", ft, [
          (p(), c(I, null, P(a, (r) => e("div", {
            key: r.content,
            class: "placeholder-btn",
            draggable: "true",
            onDragstart: (w) => C(w, r),
            onDragend: R
          }, [
            e("span", null, D(r.icon), 1),
            k(" " + D(r.label), 1)
          ], 40, bt)), 64))
        ])
      ]),
      e("div", Ct, [
        y[4] || (y[4] = e("h4", null, "📋 Performance & Dates", -1)),
        e("div", $t, [
          (p(), c(I, null, P(l, (r) => e("div", {
            key: r.content,
            class: "placeholder-btn",
            draggable: "true",
            onDragstart: (w) => C(w, r),
            onDragend: R
          }, [
            e("span", null, D(r.icon), 1),
            k(" " + D(r.label), 1)
          ], 40, kt)), 64))
        ])
      ]),
      e("div", wt, [
        y[5] || (y[5] = e("h4", null, "🖼️ Employee Images", -1)),
        e("div", xt, [
          (p(), c(I, null, P(m, (r) => e("div", {
            key: r.content,
            class: "placeholder-btn",
            draggable: "true",
            onDragstart: (w) => C(w, r),
            onDragend: R
          }, [
            e("span", null, D(r.icon), 1),
            k(" " + D(r.label), 1)
          ], 40, Dt)), 64))
        ])
      ]),
      e("div", Tt, [
        y[6] || (y[6] = e("h4", null, "📝 Quick Text", -1)),
        e("div", Et, [
          (p(), c(I, null, P(G, (r) => e("div", {
            key: r.content,
            class: "placeholder-btn",
            draggable: "true",
            onDragstart: (w) => C(w, r),
            onDragend: R
          }, [
            e("span", null, D(r.icon), 1),
            k(" " + D(r.label), 1)
          ], 40, Mt)), 64))
        ])
      ])
    ]));
  }
}), It = /* @__PURE__ */ K(Rt, [["__scopeId", "data-v-72891c4b"]]), Pt = { class: "modal-header" }, St = { class: "modal-body" }, Lt = { class: "form-group" }, zt = { class: "source-options" }, Ht = { class: "radio-option" }, At = ["checked"], Bt = { class: "radio-option" }, Ut = ["checked"], Nt = {
  key: 0,
  class: "form-group"
}, Ft = ["value"], Ot = { class: "form-group" }, Gt = { class: "dimensions-group" }, Vt = { class: "dimension-input" }, Yt = ["value"], Wt = { class: "dimension-input" }, Kt = ["value"], Xt = { class: "form-group" }, Jt = { class: "preset-sizes" }, qt = { class: "modal-footer" }, jt = /* @__PURE__ */ W({
  __name: "ImageUploadModal",
  props: {
    isOpen: { type: Boolean },
    sourceType: {},
    url: {},
    width: {},
    height: {}
  },
  emits: ["close", "confirm", "update:sourceType", "update:url", "update:width", "update:height"],
  setup(M, { emit: f }) {
    const o = f, d = (g, a) => {
      o("update:width", g), o("update:height", a);
    }, b = (g) => {
      g.target === g.currentTarget && o("close");
    };
    return (g, a) => g.isOpen ? (p(), c("div", {
      key: 0,
      class: "modal",
      onClick: b
    }, [
      e("div", {
        class: "modal-content",
        onClick: a[12] || (a[12] = Ye(() => {
        }, ["stop"]))
      }, [
        e("div", Pt, [
          a[13] || (a[13] = e("h3", null, "🖼️ Add Image", -1)),
          e("span", {
            class: "close",
            onClick: a[0] || (a[0] = (l) => g.$emit("close"))
          }, "×")
        ]),
        e("div", St, [
          e("div", Lt, [
            a[16] || (a[16] = e("label", null, "Image Source:", -1)),
            e("div", zt, [
              e("label", Ht, [
                e("input", {
                  type: "radio",
                  value: "upload",
                  checked: g.sourceType === "upload",
                  onChange: a[1] || (a[1] = (l) => g.$emit("update:sourceType", "upload"))
                }, null, 40, At),
                a[14] || (a[14] = e("span", null, "📁 Upload from Computer", -1))
              ]),
              e("label", Bt, [
                e("input", {
                  type: "radio",
                  value: "url",
                  checked: g.sourceType === "url",
                  onChange: a[2] || (a[2] = (l) => g.$emit("update:sourceType", "url"))
                }, null, 40, Ut),
                a[15] || (a[15] = e("span", null, "🌐 Image URL", -1))
              ])
            ])
          ]),
          g.sourceType === "url" ? (p(), c("div", Nt, [
            a[17] || (a[17] = e("label", { for: "imageUrl" }, "Image URL:", -1)),
            e("input", {
              id: "imageUrl",
              type: "url",
              value: g.url,
              onInput: a[3] || (a[3] = (l) => g.$emit("update:url", l.target.value)),
              placeholder: "https://example.com/image.jpg"
            }, null, 40, Ft)
          ])) : H("", !0),
          e("div", Ot, [
            a[22] || (a[22] = e("label", null, "Image Dimensions:", -1)),
            e("div", Gt, [
              e("div", Vt, [
                a[18] || (a[18] = e("label", { for: "imageWidth" }, "Width:", -1)),
                e("input", {
                  id: "imageWidth",
                  type: "number",
                  value: g.width,
                  onInput: a[4] || (a[4] = (l) => g.$emit("update:width", Number(l.target.value))),
                  min: "50",
                  max: "500"
                }, null, 40, Yt),
                a[19] || (a[19] = e("span", null, "px", -1))
              ]),
              e("div", Wt, [
                a[20] || (a[20] = e("label", { for: "imageHeight" }, "Height:", -1)),
                e("input", {
                  id: "imageHeight",
                  type: "number",
                  value: g.height,
                  onInput: a[5] || (a[5] = (l) => g.$emit("update:height", Number(l.target.value))),
                  min: "50",
                  max: "500"
                }, null, 40, Kt),
                a[21] || (a[21] = e("span", null, "px", -1))
              ])
            ])
          ]),
          e("div", Xt, [
            e("div", Jt, [
              e("button", {
                type: "button",
                class: "preset-btn",
                onClick: a[6] || (a[6] = (l) => d(120, 150))
              }, " 👤 Profile (120×150) "),
              e("button", {
                type: "button",
                class: "preset-btn",
                onClick: a[7] || (a[7] = (l) => d(200, 100))
              }, " 📄 Banner (200×100) "),
              e("button", {
                type: "button",
                class: "preset-btn",
                onClick: a[8] || (a[8] = (l) => d(150, 150))
              }, " ⬜ Square (150×150) "),
              e("button", {
                type: "button",
                class: "preset-btn",
                onClick: a[9] || (a[9] = (l) => d(300, 200))
              }, " 🖼️ Large (300×200) ")
            ])
          ])
        ]),
        e("div", qt, [
          e("button", {
            type: "button",
            class: "btn btn-secondary",
            onClick: a[10] || (a[10] = (l) => g.$emit("close"))
          }, " Cancel "),
          e("button", {
            type: "button",
            class: "btn btn-primary",
            onClick: a[11] || (a[11] = (l) => g.$emit("confirm"))
          }, " Add Image ")
        ])
      ])
    ])) : H("", !0);
  }
}), Qt = /* @__PURE__ */ K(jt, [["__scopeId", "data-v-9beee7aa"]]), Zt = { class: "text-formatting-controls" }, _t = /* @__PURE__ */ W({
  __name: "TextFormattingControls",
  props: {
    selectedElement: {}
  },
  emits: ["apply-heading", "apply-font-family", "apply-text-color", "apply-background-color", "format-text", "align-text", "increase-font-size", "decrease-font-size"],
  setup(M) {
    return (f, o) => (p(), c("div", Zt, [
      e("select", {
        class: "format-select",
        onChange: o[0] || (o[0] = (d) => f.$emit("apply-heading", d.target.value))
      }, o[12] || (o[12] = [
        re('<option value="" data-v-5d2a78d2>Format</option><option value="h1" data-v-5d2a78d2>H1 - Large Heading</option><option value="h2" data-v-5d2a78d2>H2 - Heading</option><option value="h3" data-v-5d2a78d2>H3 - Sub Heading</option><option value="h4" data-v-5d2a78d2>H4 - Small Heading</option><option value="h5" data-v-5d2a78d2>H5 - Tiny Heading</option><option value="p" data-v-5d2a78d2>P - Normal Text</option><option value="pre" data-v-5d2a78d2>PRE - Code/Preformatted</option>', 8)
      ]), 32),
      e("select", {
        class: "format-select",
        onChange: o[1] || (o[1] = (d) => f.$emit("apply-font-family", d.target.value))
      }, o[13] || (o[13] = [
        re('<option value="" data-v-5d2a78d2>Font Family</option><option value="Arial, sans-serif" data-v-5d2a78d2>Arial</option><option value="&#39;Times New Roman&#39;, serif" data-v-5d2a78d2>Times New Roman</option><option value="&#39;Courier New&#39;, monospace" data-v-5d2a78d2>Courier New</option><option value="Georgia, serif" data-v-5d2a78d2>Georgia</option><option value="Verdana, sans-serif" data-v-5d2a78d2>Verdana</option><option value="&#39;Comic Sans MS&#39;, cursive" data-v-5d2a78d2>Comic Sans</option><option value="Impact, fantasy" data-v-5d2a78d2>Impact</option><option value="&#39;Trebuchet MS&#39;, sans-serif" data-v-5d2a78d2>Trebuchet</option><option value="&#39;Amiri&#39;, serif" data-v-5d2a78d2>Amiri (Arabic)</option><option value="&#39;Noto Sans Arabic&#39;, sans-serif" data-v-5d2a78d2>Noto Sans Arabic</option><option value="&#39;Cairo&#39;, sans-serif" data-v-5d2a78d2>Cairo (Arabic)</option><option value="&#39;Scheherazade New&#39;, serif" data-v-5d2a78d2>Scheherazade New (Arabic)</option><option value="&#39;Markazi Text&#39;, serif" data-v-5d2a78d2>Markazi Text (Arabic)</option>', 14)
      ]), 32),
      e("input", {
        type: "color",
        class: "color-input",
        title: "Text Color",
        onChange: o[2] || (o[2] = (d) => f.$emit("apply-text-color", d.target.value))
      }, null, 32),
      e("input", {
        type: "color",
        class: "color-input",
        title: "Background Color",
        value: "#ffffff",
        onChange: o[3] || (o[3] = (d) => f.$emit("apply-background-color", d.target.value))
      }, null, 32),
      e("button", {
        class: "format-btn",
        onClick: o[4] || (o[4] = (d) => f.$emit("format-text", "bold"))
      }, o[14] || (o[14] = [
        e("strong", null, "B", -1)
      ])),
      e("button", {
        class: "format-btn",
        onClick: o[5] || (o[5] = (d) => f.$emit("format-text", "italic"))
      }, o[15] || (o[15] = [
        e("em", null, "I", -1)
      ])),
      e("button", {
        class: "format-btn",
        onClick: o[6] || (o[6] = (d) => f.$emit("format-text", "underline"))
      }, o[16] || (o[16] = [
        e("u", null, "U", -1)
      ])),
      e("button", {
        class: "format-btn",
        onClick: o[7] || (o[7] = (d) => f.$emit("increase-font-size"))
      }, " 🔍+ "),
      e("button", {
        class: "format-btn",
        onClick: o[8] || (o[8] = (d) => f.$emit("decrease-font-size"))
      }, " 🔍- "),
      e("button", {
        class: "format-btn",
        onClick: o[9] || (o[9] = (d) => f.$emit("align-text", "left"))
      }, " ⬅️ Left "),
      e("button", {
        class: "format-btn",
        onClick: o[10] || (o[10] = (d) => f.$emit("align-text", "center"))
      }, " ↔️ Center "),
      e("button", {
        class: "format-btn",
        onClick: o[11] || (o[11] = (d) => f.$emit("align-text", "right"))
      }, " ➡️ Right ")
    ]));
  }
}), en = /* @__PURE__ */ K(_t, [["__scopeId", "data-v-5d2a78d2"]]), tn = { class: "hr-document-editor" }, nn = {
  key: 0,
  class: "selection-counter"
}, on = { class: "control-buttons" }, ln = ["disabled"], an = ["disabled"], sn = { class: "editor-layout" }, dn = {
  key: 0,
  class: "grid-overlay visible"
}, rn = {
  key: 1,
  class: "ruler-overlay visible"
}, un = { class: "output-section" }, pn = /* @__PURE__ */ W({
  __name: "HRDocumentEditor",
  props: {
    initialElements: { default: () => [] },
    canvasWidth: { default: "794px" },
    canvasHeight: { default: "1123px" }
  },
  emits: ["elementsChanged", "documentGenerated"],
  setup(M, { emit: f }) {
    const o = M, d = f, b = x(), g = x(), a = x(), l = x([...o.initialElements]), m = x([]), G = O(
      () => m.value.length === 1 ? l.value.find((n) => n.id === m.value[0]) : null
    ), C = x([]), R = x(0), S = x(!1), T = x(!1), y = x(!0), r = x(!1), w = x(!1), A = x("a4"), X = x(""), h = de({
      isOpen: !1,
      sourceType: "upload",
      url: "",
      width: 200,
      height: 150
    }), V = de({
      isDragging: !1,
      draggedItem: null,
      dragOffset: { x: 0, y: 0 }
    }), ne = O(() => [
      "canvas",
      A.value,
      {
        landscape: w.value,
        bordered: r.value,
        "drag-over": V.isDragging
      }
    ]), z = () => Math.random().toString(36).substr(2, 9), Z = () => {
      const n = b.value?.getBoundingClientRect();
      if (!n) return;
      const t = Math.random() * (n.width - 200) + 50, s = Math.random() * (n.height - 100) + 50, $ = {
        id: z(),
        type: "text",
        content: "Click to edit text...",
        position: { x: t, y: s },
        selected: !1
      };
      l.value.push($), E($.id), d("elementsChanged", l.value);
    }, oe = () => {
      h.isOpen = !0, h.sourceType = "upload", h.url = "", h.width = 200, h.height = 150;
    }, _ = () => {
      h.isOpen = !1;
    }, le = () => {
      if (h.sourceType === "upload")
        g.value?.click();
      else {
        if (!h.url.trim()) {
          alert("Please enter a valid image URL.");
          return;
        }
        const n = b.value?.getBoundingClientRect();
        if (!n) return;
        const t = Math.random() * (n.width - h.width) + 50, s = Math.random() * (n.height - h.height) + 50, $ = {
          id: z(),
          type: "image",
          content: h.url,
          position: { x: t, y: s },
          dimensions: { width: h.width, height: h.height },
          selected: !1
        };
        l.value.push($), d("elementsChanged", l.value);
      }
      _();
    }, ae = () => {
      const n = b.value?.getBoundingClientRect();
      if (!n) return;
      const t = Math.random() * (n.width - 200) + 50, s = Math.random() * (n.height - 50) + 50, $ = {
        id: z(),
        type: "horizontal-line",
        content: "",
        position: { x: t, y: s },
        dimensions: { width: 200, height: 2 },
        selected: !1
      };
      l.value.push($), d("elementsChanged", l.value);
    }, i = () => {
      const n = b.value?.getBoundingClientRect();
      if (!n) return;
      const t = Math.random() * (n.width - 50) + 50, s = Math.random() * (n.height - 100) + 50, $ = {
        id: z(),
        type: "vertical-line",
        content: "",
        position: { x: t, y: s },
        dimensions: { width: 2, height: 100 },
        selected: !1
      };
      l.value.push($), d("elementsChanged", l.value);
    }, u = () => {
      const n = b.value?.getBoundingClientRect();
      if (!n) return;
      const t = Math.random() * (n.width - 250) + 50, s = Math.random() * (n.height - 120) + 50, $ = {
        id: z(),
        type: "table",
        content: "",
        position: { x: t, y: s },
        dimensions: { width: 200, height: 100 },
        selected: !1
      };
      l.value.push($), d("elementsChanged", l.value);
    }, v = (n) => {
      if (!n.trim()) {
        alert("Please enter some text");
        return;
      }
      const t = b.value?.getBoundingClientRect();
      if (!t) return;
      const s = Math.random() * (t.width - 200) + 50, $ = Math.random() * (t.height - 100) + 50, U = {
        id: z(),
        type: "text",
        content: n,
        position: { x: s, y: $ },
        selected: !1
      };
      l.value.push(U), d("elementsChanged", l.value);
    }, E = (n, t = !1) => {
      t ? m.value.includes(n) ? m.value = m.value.filter((s) => s !== n) : m.value.push(n) : m.value = [n], l.value.forEach((s) => {
        s.selected = m.value.includes(s.id);
      });
    }, se = (n) => {
      l.value = l.value.filter((t) => t.id !== n), m.value = m.value.filter((t) => t !== n), d("elementsChanged", l.value);
    }, B = (n, t) => {
      const s = l.value.findIndex(($) => $.id === n);
      s !== -1 && (l.value[s] = { ...l.value[s], ...t }, d("elementsChanged", l.value));
    }, L = () => {
      m.value = [], l.value.forEach((n) => {
        n.selected = !1;
      });
    }, me = (n) => {
      n.target === b.value && L();
    }, ge = () => {
      S.value = !S.value;
    }, ve = () => {
      T.value = !T.value;
    }, ye = () => {
      y.value = !y.value;
    }, he = () => {
      r.value = !r.value;
    }, fe = () => {
      w.value = !w.value;
    }, be = () => {
      console.log("Page size changed to:", A.value);
    }, Ce = () => {
      if (m.value.length < 2) return;
      const n = `group_${++R.value}`, t = l.value.filter((N) => m.value.includes(N.id));
      let s = 1 / 0, $ = 1 / 0, U = -1 / 0, J = -1 / 0;
      t.forEach((N) => {
        const ee = N.position.x, te = N.position.y, Fe = N.dimensions?.width || 100, Oe = N.dimensions?.height || 50;
        s = Math.min(s, ee), $ = Math.min($, te), U = Math.max(U, ee + Fe), J = Math.max(J, te + Oe);
      });
      const q = {
        id: n,
        elements: [...m.value],
        position: { x: s - 5, y: $ - 5 },
        dimensions: { width: U - s + 10, height: J - $ + 10 }
      };
      C.value.push(q), L();
    }, $e = () => {
      console.log("Ungrouping selected elements");
    }, ke = (n) => {
      const t = C.value.find((s) => s.id === n);
      t && (m.value = [...t.elements]);
    }, we = (n, t) => {
      const s = C.value.find(($) => $.id === n);
      s && (s.position = t);
    }, xe = () => {
      confirm("Are you sure you want to clear the entire canvas?") && (l.value = [], m.value = [], C.value = [], d("elementsChanged", l.value));
    }, De = () => {
      let n = '<div class="hr-document">';
      l.value.forEach((t) => {
        const s = `position: absolute; left: ${t.position.x}px; top: ${t.position.y}px;`;
        switch (t.type) {
          case "text":
            n += `<div style="${s}">${t.content}</div>`;
            break;
          case "image":
            n += `<img src="${t.content}" style="${s}" alt="HR Document Image">`;
            break;
        }
      }), n += "</div>", X.value = n, d("documentGenerated", n), navigator.clipboard.writeText(n).then(() => {
        alert("✅ HR document HTML generated and copied to clipboard!");
      }).catch(() => {
        alert("✅ HR document HTML generated! Check the output box below.");
      });
    }, Te = (n) => {
      console.log("Apply heading:", n);
    }, Ee = (n) => {
      console.log("Apply font family:", n);
    }, Me = (n) => {
      console.log("Apply text color:", n);
    }, Re = (n) => {
      console.log("Apply background color:", n);
    }, Ie = (n) => {
      console.log("Format text:", n);
    }, Pe = (n) => {
      console.log("Align text:", n);
    }, Se = () => {
      console.log("Increase font size");
    }, Le = () => {
      console.log("Decrease font size");
    }, ze = (n) => {
      n.preventDefault(), n.dataTransfer.dropEffect = "copy";
    }, He = (n) => {
      n.preventDefault();
    }, Ae = (n) => {
      n.preventDefault(), V.isDragging = !0;
    }, Be = (n) => {
      b.value?.contains(n.relatedTarget) || (V.isDragging = !1);
    }, Ue = (n) => {
      V.draggedItem = n;
    }, ue = (n) => {
      const t = n.target, s = t.files?.[0];
      if (!s) return;
      if (s.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB"), t.value = "";
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(s.type)) {
        alert("Please select a valid image file (JPEG, PNG, JPG, GIF)"), t.value = "";
        return;
      }
      const U = new FileReader();
      U.onload = (J) => {
        const q = b.value?.getBoundingClientRect();
        if (!q) return;
        const N = Math.random() * (q.width - h.width) + 50, ee = Math.random() * (q.height - h.height) + 50, te = {
          id: z(),
          type: "image",
          content: J.target?.result,
          position: { x: N, y: ee },
          dimensions: { width: h.width, height: h.height },
          selected: !1
        };
        l.value.push(te), d("elementsChanged", l.value);
      }, U.readAsDataURL(s), t.value = "";
    }, Ne = (n) => {
      ue(n);
    };
    return We(() => {
      Ke(() => {
        Z();
        const n = {
          id: z(),
          type: "placeholder",
          content: "{employee_name}",
          position: { x: 50, y: 100 },
          selected: !1
        };
        l.value.push(n), d("elementsChanged", l.value);
      });
    }), (n, t) => (p(), c("div", tn, [
      t[23] || (t[23] = e("h1", null, "👥 HR Document Layout Editor", -1)),
      m.value.length > 0 ? (p(), c("div", nn, D(m.value.length) + " element(s) selected ", 1)) : H("", !0),
      e("div", on, [
        e("button", {
          class: "btn btn-primary",
          onClick: Z
        }, t[6] || (t[6] = [
          e("span", null, "📝", -1),
          k(" Add Text ")
        ])),
        e("button", {
          class: "btn btn-primary",
          onClick: oe
        }, t[7] || (t[7] = [
          e("span", null, "🖼️", -1),
          k(" Add Image ")
        ])),
        e("button", {
          class: "btn btn-info",
          onClick: ge
        }, t[8] || (t[8] = [
          e("span", null, "📐", -1),
          k(" Toggle Grid ")
        ])),
        e("button", {
          class: "btn btn-info",
          onClick: ve
        }, t[9] || (t[9] = [
          e("span", null, "📏", -1),
          k(" Toggle Ruler ")
        ])),
        e("button", {
          class: "btn btn-primary",
          onClick: ae
        }, t[10] || (t[10] = [
          e("span", null, "━", -1),
          k(" Add HR Line ")
        ])),
        e("button", {
          class: "btn btn-primary",
          onClick: i
        }, t[11] || (t[11] = [
          e("span", null, "┃", -1),
          k(" Add V Line ")
        ])),
        e("button", {
          class: "btn btn-primary",
          onClick: u
        }, t[12] || (t[12] = [
          e("span", null, "🏗️", -1),
          k(" Add Table ")
        ])),
        e("button", {
          class: "btn btn-success",
          onClick: Ce,
          disabled: m.value.length < 2
        }, t[13] || (t[13] = [
          e("span", null, "📦", -1),
          k(" Group Selected ")
        ]), 8, ln),
        e("button", {
          class: "btn btn-warning",
          onClick: $e,
          disabled: m.value.length === 0
        }, t[14] || (t[14] = [
          e("span", null, "📂", -1),
          k(" Ungroup ")
        ]), 8, an),
        e("button", {
          class: "btn btn-info",
          onClick: ye
        }, t[15] || (t[15] = [
          e("span", null, "👁️", -1),
          k(" Toggle Groups ")
        ])),
        e("button", {
          class: "btn btn-info",
          onClick: he
        }, t[16] || (t[16] = [
          e("span", null, "🔲", -1),
          k(" Page Border ")
        ])),
        F(e("select", {
          "onUpdate:modelValue": t[0] || (t[0] = (s) => A.value = s),
          onChange: be,
          class: "btn page-size-select"
        }, t[17] || (t[17] = [
          re('<option value="" data-v-f7f7d972>Page Size</option><optgroup label="📄 Standard Pages" data-v-f7f7d972><option value="a4" data-v-f7f7d972>A4 (210×297mm)</option><option value="a3" data-v-f7f7d972>A3 (297×420mm)</option><option value="a5" data-v-f7f7d972>A5 (148×210mm)</option><option value="letter" data-v-f7f7d972>Letter (8.5×11in)</option><option value="legal" data-v-f7f7d972>Legal (8.5×14in)</option><option value="tabloid" data-v-f7f7d972>Tabloid (11×17in)</option></optgroup><optgroup label="🎴 Card Sizes" data-v-f7f7d972><option value="business-card" data-v-f7f7d972>Business Card (3.5×2in)</option><option value="id-card" data-v-f7f7d972>ID Card (3.375×2.125in)</option><option value="badge" data-v-f7f7d972>Badge (4×3in)</option><option value="postcard" data-v-f7f7d972>Postcard (6×4in)</option><option value="greeting-card" data-v-f7f7d972>Greeting Card (5×7in)</option><option value="certificate" data-v-f7f7d972>Certificate (11×8.5in)</option></optgroup><optgroup label="📱 Digital Sizes" data-v-f7f7d972><option value="mobile" data-v-f7f7d972>Mobile (375×812px)</option><option value="tablet" data-v-f7f7d972>Tablet (768×1024px)</option><option value="desktop" data-v-f7f7d972>Desktop (1920×1080px)</option></optgroup>', 4)
        ]), 544), [
          [Xe, A.value]
        ]),
        e("button", {
          class: "btn btn-info",
          onClick: fe
        }, [
          t[18] || (t[18] = e("span", null, "🔄", -1)),
          k(" " + D(w.value ? "Landscape" : "Portrait"), 1)
        ]),
        ie(en, {
          "selected-element": G.value,
          onApplyHeading: Te,
          onApplyFontFamily: Ee,
          onApplyTextColor: Me,
          onApplyBackgroundColor: Re,
          onFormatText: Ie,
          onAlignText: Pe,
          onIncreaseFontSize: Se,
          onDecreaseFontSize: Le
        }, null, 8, ["selected-element"]),
        e("button", {
          class: "btn btn-warning",
          onClick: xe
        }, t[19] || (t[19] = [
          e("span", null, "🗑️", -1),
          k(" Clear ")
        ])),
        e("button", {
          class: "btn btn-success",
          onClick: De
        }, t[20] || (t[20] = [
          e("span", null, "💾", -1),
          k(" Generate HR Document ")
        ]))
      ]),
      e("div", sn, [
        e("div", {
          ref_key: "canvasRef",
          ref: b,
          class: Y(ne.value),
          onClick: me,
          onDragover: ze,
          onDrop: He,
          onDragenter: Ae,
          onDragleave: Be
        }, [
          S.value ? (p(), c("div", dn)) : H("", !0),
          T.value ? (p(), c("div", rn, t[21] || (t[21] = [
            e("div", { class: "ruler-horizontal" }, null, -1),
            e("div", { class: "ruler-vertical" }, null, -1)
          ]))) : H("", !0),
          (p(!0), c(I, null, P(l.value, (s) => (p(), ce(at, {
            key: s.id,
            element: s,
            selected: m.value.includes(s.id),
            onSelect: E,
            onDelete: se,
            onUpdate: B
          }, null, 8, ["element", "selected"]))), 128)),
          (p(!0), c(I, null, P(C.value, (s) => (p(), ce(dt, {
            key: s.id,
            group: s,
            visible: y.value,
            onSelect: ke,
            onMove: we
          }, null, 8, ["group", "visible"]))), 128))
        ], 34),
        ie(It, {
          onDragStart: Ue,
          onAddCustomText: v
        })
      ]),
      e("div", un, [
        t[22] || (t[22] = e("h3", null, "📤 Generated HR Document HTML", -1)),
        F(e("textarea", {
          "onUpdate:modelValue": t[1] || (t[1] = (s) => X.value = s),
          placeholder: "Your HR document HTML will appear here...",
          readonly: "",
          class: "html-output"
        }, null, 512), [
          [Q, X.value]
        ])
      ]),
      ie(Qt, {
        "is-open": h.isOpen,
        "source-type": h.sourceType,
        url: h.url,
        width: h.width,
        height: h.height,
        onClose: _,
        onConfirm: le,
        "onUpdate:sourceType": t[2] || (t[2] = (s) => h.sourceType = s),
        "onUpdate:url": t[3] || (t[3] = (s) => h.url = s),
        "onUpdate:width": t[4] || (t[4] = (s) => h.width = s),
        "onUpdate:height": t[5] || (t[5] = (s) => h.height = s)
      }, null, 8, ["is-open", "source-type", "url", "width", "height"]),
      e("input", {
        ref_key: "imageUploadRef",
        ref: g,
        type: "file",
        accept: "image/*",
        style: { display: "none" },
        onChange: ue
      }, null, 544),
      e("input", {
        ref_key: "employeePhotoUploadRef",
        ref: a,
        type: "file",
        accept: "image/jpeg,image/png,image/jpg",
        style: { display: "none" },
        onChange: Ne
      }, null, 544)
    ]));
  }
}), cn = /* @__PURE__ */ K(pn, [["__scopeId", "data-v-f7f7d972"]]), gn = {
  install(M) {
    M.component("HRDocumentEditor", cn);
  }
};
export {
  at as CanvasElement,
  dt as GroupContainer,
  cn as HRDocumentEditor,
  Qt as ImageUploadModal,
  It as PlaceholdersPanel,
  en as TextFormattingControls,
  gn as default
};

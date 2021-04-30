/* eslint-disable */
export default (Vue) => {
  Vue.directive("ellipsis", {
    bind(el) {
      const host = document.createElement("div");
      host.className = "fdd-tooltip fdd-tooltip-placement-top";
      host.style.position = "fixed";
      host.style.transform = "translate(-50%, -90%)";
      host.style.maxWidth = "600px";

      let hostFocused = false;

      host.addEventListener("mousemove", () => {
        hostFocused = true;
      });

      host.addEventListener("mouseleave", () => {
        hostFocused = false;
      });

      host.addEventListener("mouseout", () => {
        hostFocused = false;
      });

      let mounted = false;
      let ticker = null;
      let current = null;

      el.addEventListener("mousemove", (ev) => {
        // find target element
        let t = undefined;
        if (
          ev.target.clientWidth < ev.target.scrollWidth ||
          ev.target.style.whiteSpace !== ""
        ) {
          t = ev.target;
        } else {
          ev.target.closest("[data-ellipsis]");
        }
        if (!t) return dismiss();
        // if (t.clientWidth > t.scrollWidth) return dismiss();
        // if (t.clientWidth === t.scrollWidth) return dismiss();

        // detect ellipsis content
        const title = t
          ? t.dataset.ellipsis
            ? t.dataset.ellipsis
            : t.innerText
          : "";
        // prevent default title behavior
        t.title = t.title ? "" : "";
        if (!title) return dismiss();

        // everything goes right
        ev.stopPropagation();
        clearTimeout(ticker);
        if (hostFocused) return;
        if (current !== t) dismiss();

        ticker = setTimeout(() => {
          hostFocused = false;
          dismiss();
          const tRect = t.getBoundingClientRect();
          host.innerHTML = `<div class="fdd-tooltip-content"><div class="fdd-tooltip-arrow"></div><div class="fdd-tooltip-inner">${title}</div></div>`;
          host.style.left = `${tRect.left + tRect.width / 2}px`;
          host.style.top = `${tRect.top}px`;
          // host.style.minWidth = title.length > 20 ? '400px' : '';
          document.body.appendChild(host);
          mounted = true;
          current = t;
          document.body.addEventListener("mousemove", dismiss);
        }, 300);
      });
      el.addEventListener("scroll", dismiss);
      // el.addEventListener('mouseout', dismiss);

      function dismiss() {
        clearTimeout(ticker);
        if (mounted && !hostFocused) {
          document.body.removeChild(host);
          mounted = false;
          current = null;
          document.body.removeEventListener("mousemove", dismiss);
        }
      }
    },
  });
};

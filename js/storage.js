/* ==================================================
   JSON STUDIO LITE – Storage (History via localStorage)
   Exposes window.JSL.storage
   ================================================== */

(function () {
  const JSL = (window.JSL = window.JSL || {});
  const KEY = "jsl_history_v1";
  const LIMIT = 10;

  const storage = (JSL.storage = {
    saveHistory,
    getHistory,
    clearHistory,
    deleteHistory,
    getById,
  });

  function getRaw() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function setRaw(arr) {
    try {
      localStorage.setItem(KEY, JSON.stringify(arr || []));
    } catch {
      // ignore quota errors silently; UI should still work without history
    }
  }

  function niceTs(ms) {
    try {
      if (window.dayjs) {
        const d = window.dayjs(ms);
        const now = window.dayjs();
        const diffMin = Math.abs(now.diff(d, "minute"));
        if (diffMin < 1) return "just now";
        if (diffMin < 60) return `${diffMin} min ago`;
        if (Math.abs(now.diff(d, "day")) < 1) return d.format("[today] HH:mm");
        return d.format("YYYY-MM-DD HH:mm");
      }
    } catch {}
    // fallback
    return new Date(ms).toLocaleString();
  }

  function makeId() {
    return (
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 7)
    ).toUpperCase();
  }

  /**
   * Save a history item
   * @param {{mode:'text-json'|'csv-json', input:string, output:string}} payload
   * @returns {string} id
   */
  function saveHistory(payload) {
    const list = getRaw();
    const item = {
      id: makeId(),
      ts: Date.now(),
      tsLabel: niceTs(Date.now()),
      mode: payload.mode,
      input: payload.input || "",
      output: payload.output || "",
    };
    // unshift (most recent first)
    list.unshift(item);
    // dedupe: drop exact duplicates of output+mode at top (keep latest)
    for (let i = list.length - 1; i >= 1; i--) {
      if (list[i].mode === item.mode && list[i].output === item.output) {
        list.splice(i, 1);
      }
    }
    // cap
    if (list.length > LIMIT) list.length = LIMIT;
    setRaw(list);
    return item.id;
  }

  /** @returns {Array<{id,ts,tsLabel,mode,input,output}>} */
  function getHistory() {
    const list = getRaw();
    // refresh labels if a new session/day opened
    return list.map((x) => ({ ...x, tsLabel: x.tsLabel || niceTs(x.ts) }));
  }

  function getById(id) {
    return getRaw().find((x) => x.id === id) || null;
  }

  function deleteHistory(id) {
    const list = getRaw().filter((x) => x.id !== id);
    setRaw(list);
  }

  function clearHistory() {
    setRaw([]);
  }
})();

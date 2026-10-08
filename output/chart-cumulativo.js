function buildChartCumulativo() {
  const ctx = document.getElementById('chartCumulativo');
  if (!ctx) return;

  const giorni = globalSeries.giorni;
  const posts = buildAllPosts();

  function getMonday(d) {
    const dt = new Date(d);
    const day = dt.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const mon = new Date(dt);
    mon.setDate(dt.getDate() + diff);
    return mon.toISOString().slice(0, 10);
  }

  // Costruisci mappa per settimana
  const settMap = {};
  const sortedGiorni = [...giorni].sort((a, b) => a.data.localeCompare(b.data));

  for (const g of sortedGiorni) {
    if (g.impressioni === 0) continue;
    const mon = getMonday(g.data);
    if (!settMap[mon]) settMap[mon] = { imp: 0, posts: [] };
    settMap[mon].imp += g.impressioni;
  }

  for (const p of posts) {
    const mon = getMonday(p.data);
    if (!settMap[mon]) settMap[mon] = { imp: 0, posts: [] };
    settMap[mon].posts.push(p);
  }

  const settKeys = Object.keys(settMap).sort();
  const labels = [];
  const cumValues = [];
  const weekPostsList = [];
  const postCounts = [];

  let cumulative = 0;
  for (const k of settKeys) {
    const [y, m, d] = k.split('-');
    labels.push(`${d}/${m}`);
    cumulative += settMap[k].imp;
    cumValues.push(cumulative);
    weekPostsList.push(settMap[k].posts);
    postCounts.push(settMap[k].posts.length);
  }

  // Dataset scatter: null per settimane senza post, valore cumulativo altrimenti
  const postPointData = labels.map((_, i) => postCounts[i] > 0 ? cumValues[i] : null);

  // Plugin: disegna il numero dentro ogni cerchio ciano
  const postNumberPlugin = {
    id: 'postNumberPlugin',
    afterDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(1);
      if (!meta) return;
      const c = chart.ctx;
      meta.data.forEach((point, i) => {
        if (postCounts[i] === 0 || postPointData[i] === null) return;
        const pc = postCounts[i];
        c.save();
        c.font = `bold ${pc >= 2 ? 11 : 9}px sans-serif`;
        c.fillStyle = '#000';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(String(pc), point.x, point.y);
        c.restore();
      });
    }
  };

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Impressioni cumulative',
          data: cumValues,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79,70,229,0.07)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2,
          order: 2
        },
        {
          label: 'Post pubblicati',
          data: postPointData,
          type: 'line',
          showLine: false,
          spanGaps: false,
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: 'rgba(0,0,0,0.25)',
          pointBorderWidth: 1,
          pointRadius: labels.map((_, i) => postCounts[i] >= 2 ? 13 : (postCounts[i] === 1 ? 10 : 0)),
          pointHoverRadius: labels.map((_, i) => postCounts[i] >= 2 ? 16 : (postCounts[i] === 1 ? 13 : 0)),
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          padding: 12,
          callbacks: {
            title: (items) => `Settimana del ${items[0].label}`,
            label: (item) => {
              // Dataset 0: linea cumulativa
              if (item.datasetIndex === 0) {
                return `Cumulativo: ${item.raw.toLocaleString('it-IT')} impressioni`;
              }
              // Dataset 1: cerchi post (null = settimana senza post, filtrata)
              const wPosts = weekPostsList[item.dataIndex];
              if (!wPosts || wPosts.length === 0) return null;
              const lines = [];
              lines.push(`📌 ${wPosts.length} post pubblicat${wPosts.length > 1 ? 'i' : 'o'} questa settimana:`);
              for (const p of wPosts) {
                const eng = p.impressioni > 0
                  ? (p.interazioni / p.impressioni * 100).toFixed(1)
                  : '0.0';
                lines.push(`‣ ${p.titolo_breve}`);
                lines.push(`  ${p.impressioni.toLocaleString('it-IT')} imp  ·  ${p.interazioni} interazioni  ·  ${eng}% eng`);
              }
              return lines;
            },
            filter: (item) => {
              // Nasconde l'entry del dataset 1 se null (settimana senza post)
              if (item.datasetIndex === 1 && item.raw === null) return false;
              return true;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#64748b', maxTicksLimit: 20, font: { size: 11 } },
          grid: { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          ticks: {
            color: '#64748b',
            callback: v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
          },
          grid: { color: 'rgba(255,255,255,0.04)' }
        }
      }
    },
    plugins: [postNumberPlugin]
  });
}

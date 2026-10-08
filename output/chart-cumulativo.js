// Funzione per il grafico cumulativo delle impressioni (aggregato per settimana)
function buildChartCumulativo() {
  const ctx = document.getElementById('chartCumulativo');
  if (!ctx) return;

  // Usa sempre TUTTI i giorni (indipendente dai filtri)
  const giorni = globalSeries.giorni;
  const posts = buildAllPosts();

  // Aggregazione per settimana (lunedì come inizio)
  function getMonday(d) {
    const dt = new Date(d);
    const day = dt.getDay(); // 0=dom, 1=lun...
    const diff = (day === 0) ? -6 : 1 - day;
    const mon = new Date(dt);
    mon.setDate(dt.getDate() + diff);
    return mon.toISOString().slice(0, 10);
  }

  const settMap = {}; // "YYYY-MM-DD" -> {imp_settimana, post_count}
  let cumulative = 0;

  // Ordina giorni per data
  const sortedGiorni = [...giorni].sort((a, b) => a.data.localeCompare(b.data));

  for (const g of sortedGiorni) {
    if (g.impressioni === 0) continue;
    const mon = getMonday(g.data);
    if (!settMap[mon]) settMap[mon] = { imp: 0, post_count: 0 };
    settMap[mon].imp += g.impressioni;
  }

  // Post per settimana
  for (const p of posts) {
    const mon = getMonday(p.data);
    if (!settMap[mon]) settMap[mon] = { imp: 0, post_count: 0 };
    settMap[mon].post_count += 1;
  }

  const settKeys = Object.keys(settMap).sort();
  const labels = [];
  const cumValues = [];
  const postCounts = [];

  cumulative = 0;
  for (const k of settKeys) {
    const [y, m, d] = k.split('-');
    labels.push(`${d}/${m}`);
    cumulative += settMap[k].imp;
    cumValues.push(cumulative);
    postCounts.push(settMap[k].post_count);
  }

  // Plugin per pallini ciano con numero di post
  const postDotPlugin = {
    id: 'postDotPlugin',
    afterDatasetsDraw(chart) {
      const { ctx: c, chartArea: { top, bottom }, scales: { x, y } } = chart;
      labels.forEach((lbl, i) => {
        const pc = postCounts[i];
        if (pc === 0) return;
        const xPos = x.getPixelForValue(i);
        const yPos = y.getPixelForValue(cumValues[i]);
        const r = pc >= 2 ? 13 : 10;
        c.save();
        c.beginPath();
        c.arc(xPos, yPos, r, 0, Math.PI * 2);
        c.fillStyle = '#06b6d4';
        c.fill();
        c.font = `bold ${r > 10 ? 11 : 9}px sans-serif`;
        c.fillStyle = '#000';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(String(pc), xPos, yPos);
        c.restore();
      });
    }
  };

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Impressioni cumulative',
        data: cumValues,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.07)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => `Settimana del ${items[0].label}`,
            label: (item) => {
              const v = item.raw;
              const pc = postCounts[item.dataIndex];
              const lines = [`Cumulativo: ${v.toLocaleString('it-IT')} imp`];
              if (pc > 0) lines.push(`\u{1F4CC} ${pc} post pubblicat${pc > 1 ? 'i' : 'o'}`);
              return lines;
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
            callback: v => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v
          },
          grid: { color: 'rgba(255,255,255,0.04)' }
        }
      }
    },
    plugins: [postDotPlugin]
  });
}

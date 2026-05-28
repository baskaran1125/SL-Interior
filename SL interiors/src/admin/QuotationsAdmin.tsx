import { useState, useRef } from 'react';
import { Plus, Trash2, Download, MessageCircle, FileText, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const slLogo = '/favicon.png';

interface ProjectItem {
  id: string;
  description: string;
  dimensions: string;
  calculation: string;
  amount: number;
}

interface ExtraItem {
  id: string;
  description: string;
  calculation: string;
  amount: number;
}

const GOLD = '#B8962E';
const DARK = '#3d3d3d';

const emptyProject = (): ProjectItem => ({
  id: Date.now().toString() + Math.random(),
  description: '',
  dimensions: '',
  calculation: '',
  amount: 0,
});

const emptyExtra = (): ExtraItem => ({
  id: Date.now().toString() + Math.random(),
  description: '',
  calculation: '',
  amount: 0,
});

const fmt = (n: number) => `₹ ${n.toLocaleString('en-IN')}`;

const formatDisplayDate = (val: string) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const todayValue = () => new Date().toISOString().split('T')[0];

const QuotationsAdmin = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  // Client details
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [quotationDate, setQuotationDate] = useState(todayValue());

  // Line items
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([emptyProject()]);
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([emptyExtra()]);

  const grandTotal = projectItems.reduce((s, i) => s + (i.amount || 0), 0);
  const extraTotal = extraItems.reduce((s, i) => s + (i.amount || 0), 0);

  // Project item handlers
  const addProject = () => setProjectItems(p => [...p, emptyProject()]);
  const removeProject = (id: string) => setProjectItems(p => p.length > 1 ? p.filter(i => i.id !== id) : p);
  const updateProject = (id: string, field: keyof ProjectItem, value: string | number) =>
    setProjectItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));

  // Extra item handlers
  const addExtra = () => setExtraItems(p => [...p, emptyExtra()]);
  const removeExtra = (id: string) => setExtraItems(p => p.length > 1 ? p.filter(i => i.id !== id) : p);
  const updateExtra = (id: string, field: keyof ExtraItem, value: string | number) =>
    setExtraItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));

  const resetForm = () => {
    setClientName(''); setClientAddress(''); setClientPhone('');
    setQuotationDate(todayValue());
    setProjectItems([emptyProject()]);
    setExtraItems([emptyExtra()]);
  };

  const generatePDF = async (): Promise<boolean> => {
    if (!previewRef.current) return false;
    setGenerating(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: previewRef.current.scrollWidth,
        windowHeight: previewRef.current.scrollHeight,
      });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();

      // Calculate how many canvas pixels fit in one A4 page
      const canvasPageH = Math.floor((canvas.width * pdfH) / pdfW);
      const totalPages = Math.ceil(canvas.height / canvasPageH);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        // Slice this page's strip from the full canvas
        const srcY = page * canvasPageH;
        const srcH = Math.min(canvasPageH, canvas.height - srcY);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = canvasPageH; // always full page height so image fills the page
        const ctx = pageCanvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

        const imgData = pageCanvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      }

      const filename = `SL_Interior_${(clientName || 'Quotation').replace(/\s+/g, '_')}_${quotationDate}.pdf`;
      pdf.save(filename);
      setGenerating(false);
      return true;
    } catch {
      setGenerating(false);
      return false;
    }
  };

  const shareWhatsApp = async () => {
    await generatePDF();
    const phone = clientPhone.replace(/[^0-9]/g, '');
    const wa = phone.startsWith('91') ? phone : `91${phone}`;
    const msg = `Dear ${clientName || 'Client'},\n\nPlease find the quotation from *S.L. Interior* for your project.\n\n📋 *Project Estimation Total:* ${fmt(grandTotal)}\n🔧 *Extra Works Total:* ${fmt(extraTotal)}\n\nFor queries, contact us:\n📞 9444291009 | 9043140047\n\nThank you for choosing S.L. Interior! 🏠`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const inputCls = 'w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors';
  const labelCls = 'text-[11px] text-zinc-500 uppercase tracking-wider mb-1 block';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quotation Generator</h1>
          <p className="text-zinc-500 text-sm mt-1">Create professional quotations and export as PDF or share via WhatsApp</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 px-3 py-2.5 text-zinc-400 border border-zinc-700/50 rounded-lg text-sm hover:text-white hover:border-zinc-600 transition-colors"
            title="Reset form"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={shareWhatsApp}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-sm hover:bg-green-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-zinc-900 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {generating ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* ── LEFT: Form ── */}
        <div className="space-y-5">

          {/* Client Details */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Client Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Client Name</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                  placeholder="e.g. Mr. Ramesh Kumar" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Client Address / Area</label>
                <input type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)}
                  placeholder="e.g. ADYAR" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Client Phone (WhatsApp)</label>
                  <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                    placeholder="9876543210" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Quotation Date</label>
                  <input type="date" value={quotationDate} onChange={e => setQuotationDate(e.target.value)}
                    className={inputCls} />
                </div>
              </div>
            </div>
          </div>

          {/* Project Estimation */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Project Estimation</h2>
              <button onClick={addProject}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1fr,90px,90px,80px,28px] gap-2 mb-1 px-1">
              {['Description', 'Dimensions', 'Calculation', 'Amount ₹', ''].map(h => (
                <span key={h} className="text-[10px] text-zinc-600 uppercase tracking-wider">{h}</span>
              ))}
            </div>

            <div className="space-y-2">
              {projectItems.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr,90px,90px,80px,28px] gap-2 items-center">
                  <input type="text" value={item.description}
                    onChange={e => updateProject(item.id, 'description', e.target.value)}
                    placeholder="Wall Box" className={inputCls + ' text-xs'} />
                  <input type="text" value={item.dimensions}
                    onChange={e => updateProject(item.id, 'dimensions', e.target.value)}
                    placeholder="5×2" className={inputCls + ' text-xs'} />
                  <input type="text" value={item.calculation}
                    onChange={e => updateProject(item.id, 'calculation', e.target.value)}
                    placeholder="10×950" className={inputCls + ' text-xs'} />
                  <input type="number" value={item.amount || ''}
                    onChange={e => updateProject(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0" className={inputCls + ' text-xs'} />
                  <button onClick={() => removeProject(item.id)} disabled={projectItems.length === 1}
                    className="p-1 text-zinc-700 hover:text-red-400 transition-colors disabled:opacity-20">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between">
              <span className="text-xs font-semibold text-zinc-400">Grand Total</span>
              <span className="text-amber-400 font-bold text-sm">{fmt(grandTotal)}</span>
            </div>
          </div>

          {/* Extra Works */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Extra Works</h2>
              <button onClick={addExtra}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            <div className="grid grid-cols-[1fr,120px,80px,28px] gap-2 mb-1 px-1">
              {['Description', 'Calculation', 'Amount ₹', ''].map(h => (
                <span key={h} className="text-[10px] text-zinc-600 uppercase tracking-wider">{h}</span>
              ))}
            </div>

            <div className="space-y-2">
              {extraItems.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr,120px,80px,28px] gap-2 items-center">
                  <input type="text" value={item.description}
                    onChange={e => updateExtra(item.id, 'description', e.target.value)}
                    placeholder="WPC Window" className={inputCls + ' text-xs'} />
                  <input type="text" value={item.calculation}
                    onChange={e => updateExtra(item.id, 'calculation', e.target.value)}
                    placeholder="24×500" className={inputCls + ' text-xs'} />
                  <input type="number" value={item.amount || ''}
                    onChange={e => updateExtra(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0" className={inputCls + ' text-xs'} />
                  <button onClick={() => removeExtra(item.id)} disabled={extraItems.length === 1}
                    className="p-1 text-zinc-700 hover:text-red-400 transition-colors disabled:opacity-20">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between">
              <span className="text-xs font-semibold text-zinc-400">Extra Works Total</span>
              <span className="text-zinc-300 font-bold text-sm">{fmt(extraTotal)}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div className="sticky top-6">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-3">Live Preview — PDF Output</p>
          <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5">
            {/* The div captured by html2canvas */}
            <div
              ref={previewRef}
              style={{
                backgroundColor: '#ffffff',
                padding: '40px',
                fontFamily: 'Arial, Helvetica, sans-serif',
                color: '#1a1a1a',
                minWidth: '600px',
              }}
            >
              {/* ── Letterhead ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
                <img
                  src={slLogo}
                  alt="S.L. Interior Logo"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  style={{ width: '80px', height: '80px', objectFit: 'contain', flexShrink: 0 }}
                />
                <div>
                  <div style={{
                    fontSize: '28px', fontWeight: '600', color: '#111',
                    letterSpacing: '6px', lineHeight: 1.2,
                    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                    textTransform: 'uppercase',
                  }}>
                    S.L. Interior
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '4px', letterSpacing: '2px', textTransform: 'uppercase' }}>Premium Interior & Architectural Solutions</div>
                  <div style={{ fontSize: '11.5px', color: '#777', marginTop: '4px' }}>No.21, MGR ST, M.G Nagar, Tharamani, Chennai - 600113</div>
                  <div style={{ fontSize: '11.5px', color: '#777', marginTop: '2px' }}>Cell: 9444291009 | 9043140047</div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#ddd', marginBottom: '20px' }} />

              {/* Client Info Box */}
              <div style={{ border: '1px solid #ddd', display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '28px' }}>
                <div style={{ padding: '14px 16px', borderRight: '1px solid #ddd' }}>
                  <div style={{ fontSize: '10px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quotation Date</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#222' }}>{formatDisplayDate(quotationDate)}</div>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '10px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client Address</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#222' }}>{clientAddress || '—'}</div>
                </div>
              </div>

              {/* ── Project Estimation ── */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ color: GOLD, fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px', marginBottom: '10px' }}>
                  PROJECT ESTIMATION
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      {['Description', 'Dimensions', 'Calculation', 'Amount'].map((h, i) => (
                        <th key={h} style={{
                          padding: '9px 11px', border: '1px solid #ddd',
                          textAlign: i === 3 ? 'right' : 'left',
                          fontWeight: '600', color: '#444', fontSize: '11px',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projectItems.map((item, i) => (
                      <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '9px 11px', border: '1px solid #ddd', color: '#333' }}>{item.description || '—'}</td>
                        <td style={{ padding: '9px 11px', border: '1px solid #ddd', color: '#333' }}>{item.dimensions || '-'}</td>
                        <td style={{ padding: '9px 11px', border: '1px solid #ddd', color: '#333' }}>{item.calculation || '-'}</td>
                        <td style={{ padding: '9px 11px', border: '1px solid #ddd', color: '#333', textAlign: 'right', fontWeight: item.amount ? '500' : 'normal' }}>
                          {item.amount ? `₹ ${item.amount.toLocaleString('en-IN')}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Grand Total bar */}
                <div style={{
                  backgroundColor: GOLD, display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '13px 11px',
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' }}>GRAND TOTAL</span>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>{fmt(grandTotal)}</span>
                </div>
              </div>

              {/* ── Extra Works ── */}
              <div style={{ marginBottom: '48px' }}>
                <div style={{ color: GOLD, fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px', marginBottom: '10px' }}>
                  EXTRA WORKS
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      {['Description', 'Calculation', 'Amount'].map((h, i) => (
                        <th key={h} style={{
                          padding: '9px 11px', border: '1px solid #ddd',
                          textAlign: i === 2 ? 'right' : 'left',
                          fontWeight: '600', color: '#444', fontSize: '11px',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {extraItems.map((item, i) => (
                      <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '9px 11px', border: '1px solid #ddd', color: '#333' }}>{item.description || '—'}</td>
                        <td style={{ padding: '9px 11px', border: '1px solid #ddd', color: '#333' }}>{item.calculation || '-'}</td>
                        <td style={{ padding: '9px 11px', border: '1px solid #ddd', color: '#333', textAlign: 'right', fontWeight: item.amount ? '500' : 'normal' }}>
                          {item.amount ? `₹ ${item.amount.toLocaleString('en-IN')}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Extra Works Total bar */}
                <div style={{
                  backgroundColor: DARK, display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '13px 11px',
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' }}>EXTRA WORKS TOTAL</span>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>{fmt(extraTotal)}</span>
                </div>
              </div>

              {/* ── Signatures ── */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                borderTop: '1px solid #ddd', paddingTop: '20px',
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#999', marginBottom: '32px' }}>Client Signature</div>
                  <div style={{ width: '160px', height: '1px', backgroundColor: '#bbb' }} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#999', marginBottom: '32px' }}>Authorized Signature</div>
                  <div style={{ width: '160px', height: '1px', backgroundColor: '#bbb', marginLeft: 'auto', marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#111' }}>R. Sudhakar</div>
                  <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>Proprietor – S.L. Interior</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationsAdmin;

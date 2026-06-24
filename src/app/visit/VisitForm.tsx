'use client'

import { useState, useRef, FormEvent } from 'react'

const REQUIRED_FIELDS = ['hostName', 'visitorName', 'company', 'contact', 'purpose']

const PURPOSE_OPTIONS = [
  { value: '', label: '请选择来访目的...', disabled: true },
  { value: 'procurement', label: '采购洽谈' },
  { value: 'cooperation', label: '商务合作' },
  { value: 'factory', label: '工厂参观' },
  { value: 'technical', label: '技术交流' },
  { value: 'other', label: '其他' },
]

interface FieldError {
  field: string
  message: string
}

export default function VisitForm() {
  const [form, setForm] = useState({
    hostName: '',
    hostTitle: '',
    visitorName: '',
    company: '',
    visitorTitle: '',
    contact: '',
    purpose: '',
    visitDate: '',
    notes: '',
  })
  const [errors, setErrors] = useState<FieldError[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [refId, setRefId] = useState('')
  const [serverError, setServerError] = useState('')

  const formRef = useRef<HTMLFormElement>(null)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => prev.filter((e) => e.field !== field))
    setServerError('')
  }

  function getError(field: string): string {
    return errors.find((e) => e.field === field)?.message || ''
  }

  function validate(): boolean {
    const errs: FieldError[] = []
    const labels: Record<string, string> = {
      hostName: '被拜访人姓名',
      visitorName: '姓名',
      company: '公司名称',
      contact: '手机号 / 微信号',
      purpose: '来访目的',
    }
    for (const f of REQUIRED_FIELDS) {
      if (!form[f as keyof typeof form].trim()) {
        errs.push({ field: f, message: `请填写${labels[f] || f}` })
      }
    }
    setErrors(errs)
    return errs.length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')

    try {
      const res = await fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || '提交失败')
      }
      setRefId(data.refId)
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setServerError(err.message || '提交失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <style>{STYLES}</style>
      <div className="grid-bg" />
      <div className="container">
        <div className="logo-wrap">
          <img src="data:image/png;base64,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" alt="RISUNIC" />
        </div>
        <div className="brand-sub">POWER · ENERGY · INNOVATION</div>

        {!success ? (
          <div className="form-card">
            <h2>访客登记</h2>
            <p className="subtitle">请填写以下信息，我们将为您安排接待</p>

            {serverError && <div className="server-error">{serverError}</div>}

            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              {/* Host Section */}
              <div className="host-section">
                <div className="host-label">被拜访人</div>
                <Field label="姓名" required error={getError('hostName')} icon={IconUser}>
                  <input
                    type="text"
                    placeholder="请输入被拜访人姓名"
                    maxLength={30}
                    value={form.hostName}
                    onChange={(e) => update('hostName', e.target.value)}
                  />
                </Field>
                <Field label="职务" icon={IconBriefcase}>
                  <input
                    type="text"
                    placeholder="如：销售总监、总经理"
                    maxLength={40}
                    value={form.hostTitle}
                    onChange={(e) => update('hostTitle', e.target.value)}
                  />
                </Field>
              </div>

              {/* Visitor Section */}
              <div className="section-label">来访人信息</div>

              <Field label="姓名" required error={getError('visitorName')} icon={IconAvatar}>
                <input
                  type="text"
                  placeholder="请输入您的姓名"
                  maxLength={30}
                  value={form.visitorName}
                  onChange={(e) => update('visitorName', e.target.value)}
                />
              </Field>

              <Field label="公司名称" required error={getError('company')} icon={IconBuilding}>
                <input
                  type="text"
                  placeholder="请输入公司名称"
                  maxLength={80}
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                />
              </Field>

              <Field label="职位" icon={IconBriefcase}>
                <input
                  type="text"
                  placeholder="如：采购经理、总经理"
                  maxLength={40}
                  value={form.visitorTitle}
                  onChange={(e) => update('visitorTitle', e.target.value)}
                />
              </Field>

              <Field label="手机号 / 微信号" required error={getError('contact')} icon={IconPhone}>
                <input
                  type="text"
                  placeholder="手机号或微信号"
                  maxLength={30}
                  value={form.contact}
                  onChange={(e) => update('contact', e.target.value)}
                />
              </Field>

              <Field label="来访目的" required error={getError('purpose')} icon={IconTarget}>
                <select
                  value={form.purpose}
                  onChange={(e) => update('purpose', e.target.value)}
                >
                  {PURPOSE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="到访日期" icon={IconCalendar}>
                <input
                  type="date"
                  min={today}
                  value={form.visitDate}
                  onChange={(e) => update('visitDate', e.target.value)}
                />
              </Field>

              <Field label="备注" icon={IconNotes}>
                <textarea
                  placeholder="如有特殊需求或问题，请在此说明..."
                  maxLength={300}
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                />
              </Field>

              <button type="submit" className={`submit-btn${loading ? ' loading' : ''}`} disabled={loading}>
                <span className="btn-spinner" />
                <span className="btn-text">提 交 登 记</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h2>登记成功</h2>
            <p>感谢您的来访登记</p>
            <p>我们的工作人员将尽快与您联系</p>
            <div className="ref">
              <div className="ref-label">登记编号</div>
              <div className="ref-id">{refId}</div>
            </div>
            <button className="new-btn" onClick={() => { setSuccess(false); setForm({ hostName: '', hostTitle: '', visitorName: '', company: '', visitorTitle: '', contact: '', purpose: '', visitDate: '', notes: '' }); setErrors([]) }}>
              新增登记
            </button>
          </div>
        )}

        <div className="footer">
          Risunic Technology (Shenzhen) Co.,Ltd<br />
          深圳市晨旭通科技股份有限公司<br />
          OEM / ODM · 全球发货 · 认证齐全
        </div>
      </div>
    </>
  )
}

// ─── Field component ───

function Field({
  label,
  required,
  error,
  icon,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className={`field${error ? ' error' : ''}`}>
      <label>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <div className={`input-wrap${error ? ' error' : ''}`}>
        <span className="input-icon">{icon}</span>
        {children}
      </div>
      {error && <div className="error-msg">{error}</div>}
    </div>
  )
}

// ─── SVG Icons (inline to avoid extra requests) ───

const IconUser = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
)
const IconAvatar = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const IconBuilding = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </svg>
)
const IconBriefcase = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)
const IconPhone = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconTarget = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
)
const IconCalendar = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IconNotes = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

// ─── Styles ───

const STYLES = `
:root {
  --bg-deep: #050B18;
  --bg-card: #0A1226;
  --bg-input: #0F1A30;
  --border: #1A2A45;
  --border-focus: #00D4AA;
  --accent: #00D4AA;
  --accent-glow: rgba(0,212,170,0.25);
  --accent-dim: rgba(0,212,170,0.08);
  --text-primary: #E8ECF1;
  --text-secondary: #8899B4;
  --text-muted: #556580;
  --text-placeholder: #3A4A65;
  --danger: #FF5E5E;
  --radius-sm: 6px;
  --radius: 10px;
  --radius-lg: 16px;
  --transition: 0.25s cubic-bezier(0.4,0,0.2,1);
  --font: -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
}
* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family:var(--font);
  background:var(--bg-deep);
  color:var(--text-primary);
  min-height:100vh;
  display:flex; flex-direction:column; align-items:center;
  -webkit-tap-highlight-color:transparent;
}
body::before {
  content:''; position:fixed; top:0; left:0; right:0; bottom:0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,212,170,0.06) 0%,transparent 70%),
    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(0,150,255,0.04) 0%,transparent 70%),
    radial-gradient(ellipse 50% 30% at 80% 60%, rgba(120,0,255,0.03) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}
.grid-bg {
  position:fixed; top:0; left:0; right:0; bottom:0; z-index:0; opacity:0.03;
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px);
  background-size:40px 40px;
}
.container {
  position:relative; z-index:1;
  width:100%; max-width:420px;
  padding:40px 24px 80px;
  display:flex; flex-direction:column; align-items:center;
}
.logo-wrap { margin-bottom:12px; animation: fadeInDown 0.6s ease; }
.logo-wrap img { height:56px; width:auto; }
.brand-sub {
  font-size:12px; color:var(--text-muted);
  letter-spacing:3px; margin-bottom:32px;
  animation: fadeInDown 0.6s ease;
}
.form-card {
  width:100%;
  background:var(--bg-card);
  border:1px solid var(--border);
  border-radius:var(--radius-lg);
  padding:28px 24px 32px;
  box-shadow:0 8px 40px rgba(0,0,0,0.3),0 0 0 1px rgba(255,255,255,0.03) inset;
  animation: fadeInUp 0.6s ease;
}
.form-card h2 { font-size:20px; font-weight:600; color:var(--text-primary); margin-bottom:4px; text-align:center; }
.form-card .subtitle { font-size:13px; color:var(--text-muted); margin-bottom:28px; text-align:center; }
.field { margin-bottom:18px; position:relative; }
.field label { display:block; font-size:13px; font-weight:600; color:var(--text-secondary); margin-bottom:6px; letter-spacing:0.5px; }
.field label .required { color:var(--danger); margin-left:2px; }
.input-wrap {
  position:relative; display:flex; align-items:center;
  background:var(--bg-input);
  border:1px solid var(--border);
  border-radius:var(--radius-sm);
  transition:all var(--transition); overflow:hidden;
}
.input-wrap:focus-within { border-color:var(--border-focus); box-shadow:0 0 0 3px var(--accent-dim); }
.input-wrap.error { border-color:var(--danger); box-shadow:0 0 0 3px rgba(255,94,94,0.1); }
.input-icon { display:flex; align-items:center; justify-content:center; width:40px; min-width:40px; color:var(--text-muted); transition:color var(--transition); }
.input-wrap:focus-within .input-icon { color:var(--accent); }
input,select,textarea {
  flex:1; width:100%;
  background:transparent; border:none; outline:none;
  color:var(--text-primary); font-size:15px;
  font-family:var(--font); padding:12px 12px 12px 0;
  caret-color:var(--accent);
}
input::placeholder,textarea::placeholder { color:var(--text-placeholder); font-size:14px; }
select { appearance:none; cursor:pointer; padding-right:32px; }
select option { background:var(--bg-card); color:var(--text-primary); }
textarea { resize:vertical; min-height:80px; }
.error-msg { font-size:12px; color:var(--danger); margin-top:4px; display:none; }
.field.error .error-msg { display:block; }
.host-section { background:rgba(0,212,170,0.04); border:1px solid rgba(0,212,170,0.12); border-radius:var(--radius); padding:18px 18px 4px; margin-bottom:24px; }
.host-label { font-size:12px; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:2px; margin-bottom:10px; }
.section-label { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:2px; margin-bottom:12px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.04); }
.server-error {
  background:rgba(255,94,94,0.08); border:1px solid rgba(255,94,94,0.2);
  border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:16px;
  font-size:13px; color:var(--danger); text-align:center;
}
.submit-btn {
  width:100%; padding:14px;
  background:linear-gradient(135deg,#00D4AA,#009E7D);
  color:#050B18; border:none; border-radius:var(--radius);
  font-size:16px; font-weight:700; cursor:pointer;
  letter-spacing:3px; transition:all var(--transition);
  position:relative; overflow:hidden; margin-top:12px;
  display:flex; align-items:center; justify-content:center;
}
.submit-btn:hover { transform:translateY(-1px); box-shadow:0 6px 24px var(--accent-glow); }
.submit-btn:active { transform:translateY(0); }
.submit-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; box-shadow:none; }
.btn-spinner { display:none; width:20px; height:20px; border:2px solid transparent; border-top-color:#050B18; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:8px; }
.submit-btn.loading .btn-text { display:none; }
.submit-btn.loading .btn-spinner { display:inline-block; }
.success-state {
  width:100%; text-align:center; padding:48px 24px;
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius-lg);
  box-shadow:0 8px 40px rgba(0,0,0,0.3);
  animation: fadeInUp 0.5s ease;
}
.success-icon { width:72px; height:72px; border-radius:50%; background:var(--accent-dim); border:2px solid var(--accent); display:flex; align-items:center; justify-content:center; margin:0 auto 24px; font-size:36px; }
.success-state h2 { font-size:22px; font-weight:700; background:linear-gradient(135deg,#00D4AA,#00A8FF); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:12px; }
.success-state p { font-size:14px; color:var(--text-secondary); line-height:2; }
.success-state .ref { margin-top:24px; padding:14px 20px; background:var(--bg-input); border-radius:var(--radius-sm); border:1px solid var(--border); }
.ref-label { font-size:12px; color:var(--text-muted); }
.ref-id { font-size:22px; font-weight:700; color:var(--accent); letter-spacing:2px; }
.new-btn {
  margin-top:20px; padding:10px 28px;
  background:transparent; border:1px solid var(--border);
  color:var(--text-secondary); border-radius:var(--radius);
  font-size:14px; cursor:pointer; transition:all var(--transition);
}
.new-btn:hover { border-color:var(--accent); color:var(--accent); }
.footer { margin-top:28px; text-align:center; font-size:11px; color:var(--text-muted); opacity:0.7; line-height:1.8; }
@keyframes fadeInDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin { to { transform:rotate(360deg); } }
@media (max-width:440px) {
  .container { padding:32px 16px 56px; }
  .form-card { padding:22px 18px 26px; }
  .logo-wrap img { height:44px; }
}
`

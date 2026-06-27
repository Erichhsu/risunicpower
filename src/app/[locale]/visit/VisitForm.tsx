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
          <img src="/logo-02.png" alt="RISUNIC" />
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

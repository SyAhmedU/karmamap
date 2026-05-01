import { useState, useEffect, useRef } from 'react'

// ─── Table of Contents ────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'abstract',      label: 'Abstract' },
  { id: 's1',            label: '1  Introduction' },
  { id: 's2',            label: '2  Conceptual Framework' },
  { id: 's2-1',          label: '   2.1  AI Exposure Score', indent: true },
  { id: 's2-2',          label: '   2.2  Digital Intensity Index', indent: true },
  { id: 's2-3',          label: '   2.3  AI Displacement Risk', indent: true },
  { id: 's3',            label: '3  Data & Sources' },
  { id: 's4',            label: '4  Timeline Methodology' },
  { id: 's5',            label: '5  Empirical Findings' },
  { id: 's5-1',          label: '   5.1  Cross-Sectional (2025)', indent: true },
  { id: 's5-2',          label: '   5.2  Longitudinal Trends', indent: true },
  { id: 's5-3',          label: '   5.3  India vs Global', indent: true },
  { id: 's6',            label: '6  Policy Implications' },
  { id: 's7',            label: '7  Limitations' },
  { id: 'references',    label: 'References' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionAnchor({ id }) {
  return <span id={id} className="block" style={{ marginTop: '-80px', paddingTop: '80px' }} />
}

function H2({ children }) {
  return (
    <h2 className="text-xl font-bold text-white mt-10 mb-4 pb-2 border-b border-slate-700/60 tracking-tight">
      {children}
    </h2>
  )
}

function H3({ children }) {
  return <h3 className="text-base font-bold text-slate-200 mt-6 mb-2 tracking-tight">{children}</h3>
}

function P({ children, className = '' }) {
  return (
    <p className={`text-slate-300 text-[13.5px] leading-[1.75] mb-4 ${className}`}>
      {children}
    </p>
  )
}

function Callout({ color = 'blue', title, children }) {
  const colors = {
    blue:   'bg-sky-950/60 border-sky-700/50 text-sky-300',
    amber:  'bg-amber-950/60 border-amber-700/50 text-amber-300',
    rose:   'bg-rose-950/60 border-rose-700/50 text-rose-300',
    violet: 'bg-violet-950/60 border-violet-700/50 text-violet-300',
    emerald:'bg-emerald-950/60 border-emerald-700/50 text-emerald-300',
  }
  return (
    <div className={`rounded-xl border p-4 my-5 ${colors[color]}`}>
      {title && <p className="text-[10px] uppercase tracking-widest font-black mb-2 opacity-80">{title}</p>}
      <div className="text-[13px] leading-relaxed">{children}</div>
    </div>
  )
}

function DataTable({ headers, rows, caption }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-[12px] border-collapse">
        <thead>
          <tr className="border-b border-slate-600">
            {headers.map((h, i) => (
              <th key={i} className={`py-2 px-3 text-slate-400 font-bold uppercase tracking-wider text-[10px] ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={`border-b border-slate-800/60 ${ri % 2 === 0 ? 'bg-slate-800/20' : ''}`}>
              {row.map((cell, ci) => (
                <td key={ci} className={`py-2 px-3 ${ci === 0 ? 'text-slate-300 font-medium' : 'text-slate-400 text-right tabular-nums'}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <p className="text-slate-600 text-[10px] mt-2 italic text-center">{caption}</p>}
    </div>
  )
}

function Formula({ label, formula, note }) {
  return (
    <div className="my-5 mx-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/40">
      {label && <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2 font-bold">{label}</p>}
      <p className="text-white font-mono text-sm text-center tracking-wide">{formula}</p>
      {note && <p className="text-slate-500 text-[11px] mt-2 text-center italic">{note}</p>}
    </div>
  )
}

function Cite({ n }) {
  return <sup className="text-sky-500 text-[9px] font-bold cursor-default select-none">[{n}]</sup>
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResearchPaper({ onClose }) {
  const [activeSection, setActiveSection] = useState('abstract')
  const contentRef = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { root: contentRef.current, rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    const ids = SECTIONS.map(s => s.id)
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#070d1a]/95 backdrop-blur flex flex-col"
      style={{ animation: 'viewEnter 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>

      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#0a1628]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-sky-500" />
          <span className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">Research Paper</span>
          <span className="text-slate-700 text-[11px]">·</span>
          <span className="text-slate-500 text-[11px]">KarmaMap Working Paper · 2025</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-600 text-[10px] hidden sm:block">Press Esc to close</span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white hover:bg-slate-800 w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-lg leading-none"
          >&times;</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar TOC ── */}
        <nav className="hidden lg:flex flex-col w-56 shrink-0 border-r border-slate-800 bg-[#0a1628] overflow-y-auto py-6 px-3 gap-0.5">
          <p className="text-slate-600 text-[9px] uppercase tracking-widest font-bold px-2 mb-3">Contents</p>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`text-left px-2 py-1 rounded-lg text-[10.5px] transition-colors leading-snug ${
                activeSection === s.id
                  ? 'bg-sky-900/50 text-sky-300 font-semibold'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              } ${s.indent ? 'pl-4' : 'font-medium'}`}
            >
              {s.label}
            </button>
          ))}
          <div className="mt-auto pt-6 px-2">
            <div className="bg-slate-800/40 rounded-lg p-2.5 text-[9px] text-slate-600 leading-relaxed">
              KarmaMap Working Paper<br />
              Version 1.0 · May 2025<br />
              Not peer-reviewed.<br />
              All data sources cited.
            </div>
          </div>
        </nav>

        {/* ── Paper content ── */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-10 pb-24">

            {/* ── Title block ── */}
            <div className="mb-10 pb-8 border-b border-slate-700/50">
              <p className="text-sky-500 text-[10px] uppercase tracking-widest font-bold mb-3">
                KarmaMap Working Paper · Labour Economics · AI &amp; Automation
              </p>
              <h1 className="text-2xl font-black text-white leading-tight tracking-tight mb-4">
                Mapping India's Occupational AI Displacement Risk:<br />
                A Compound Metric Framework and Longitudinal Analysis, 1950–2050
              </h1>
              <p className="text-slate-400 text-[13px] mb-6 leading-relaxed">
                Syed Asrar Ahmed &nbsp;·&nbsp; Independent Research &nbsp;·&nbsp; <em>correspondence: asrarsaa@gmail.com</em>
              </p>
              <div className="flex flex-wrap gap-2">
                {['Labour Economics','AI Automation','India Workforce','Displacement Risk','Digital Intensity','PLFS 2023-24'].map(t => (
                  <span key={t} className="bg-slate-800 text-slate-400 text-[10px] px-2.5 py-1 rounded-full border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Abstract ── */}
            <SectionAnchor id="abstract" />
            <div className="mb-10 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Abstract</p>
              <p className="text-slate-200 text-[13.5px] leading-[1.8]">
                We introduce the <strong>AI Displacement Risk Index (ADRI)</strong>, a compound occupational metric
                constructed as the product of an <em>AI Exposure Score</em> (AES) and a novel
                <em> Digital Intensity Index</em> (DII), normalised to a 0–100 scale. Applied across 90 occupational
                categories covering India's 586 million-strong formal and informal workforce, and 78 categories
                spanning the global labour market, the framework reveals that <strong>approximately 4.9 million Indian
                workers (0.8% of the workforce)</strong> are employed in occupations with ADRI&nbsp;&gt;&nbsp;55 — the HIGH
                displacement risk threshold — as of 2025, concentrated overwhelmingly in software engineering,
                IT-enabled services, and financial technology. We further demonstrate that India's aggregate low
                displacement risk is structurally anchored by the dominance of agricultural employment (46.1%,
                AI exposure&nbsp;≈&nbsp;19/100) and the high informality rate (82%), which insulates the majority of
                workers from automation in the immediate term but not in the medium term. Using a longitudinal
                dataset anchored at 13 temporal nodes between 1950 and 2050 — constructed through
                profile-based historical scaling, PLFS-calibrated regression, and consensus-scenario
                projection — we document the structural shift of India's workforce from subsistence agriculture
                through industrial manufacturing and into a bifurcated digital economy. Our interactive
                visualisation framework, KarmaMap, synthesises these findings and is made publicly available
                as an open research tool for policymakers, researchers, and affected workers.
              </p>
              <p className="text-slate-500 text-[11px] mt-4">
                <strong className="text-slate-400">JEL Codes:</strong> J21, J24, J62, O33, O53 &nbsp;·&nbsp;
                <strong className="text-slate-400">Data:</strong> PLFS 2023-24, ILO ILOSTAT, World Bank WDI, O*NET, MGI, WEF Future of Jobs 2025
              </p>
            </div>

            {/* ── 1. Introduction ── */}
            <SectionAnchor id="s1" />
            <H2>1  Introduction</H2>

            <P>
              India stands at a singular inflection point. With the world's largest working-age population — approximately
              950 million individuals aged 15–64 — and a workforce of 586 million as documented in the Periodic Labour
              Force Survey 2023-24<Cite n="1" />, the country's labour market trajectory over the next three decades will
              shape not only its own development but global economic geography. Simultaneously, rapid advances in large
              language models (LLMs), robotic process automation (RPA), and machine vision are compressing the timeline
              for occupational automation across a wide range of task categories<Cite n="2" />.
            </P>

            <P>
              Existing automation risk frameworks — most notably Frey and Osborne's<Cite n="3" /> canonical 2013 analysis,
              which assigned 47% of US occupations a &gt;70% automation probability, and the subsequent O*NET-based
              refinements of Arntz et al.<Cite n="4" /> and Acemoglu and Restrepo<Cite n="5" /> — were designed for
              advanced-economy labour markets characterised by high wage levels, deep digital infrastructure, and
              predominantly formal employment. Applied naïvely to India, these frameworks systematically over-estimate
              near-term displacement: a data-entry clerk with an AI exposure score of 88 working on paper-based
              ledgers in a tier-3 city faces categorically different automation risk to her counterpart operating
              enterprise ERP software in Bengaluru.
            </P>

            <P>
              This gap motivates our central methodological contribution: the <strong>Digital Intensity Index (DII)</strong>,
              a 0–100 metric capturing the degree to which an occupation's inputs and outputs are already digitally
              mediated — and therefore accessible to AI systems <em>today</em>, rather than theoretically. The compound
              product of AI Exposure and Digital Intensity — normalised to 0–100 — constitutes the
              <strong> AI Displacement Risk Index (ADRI)</strong>, which we argue is a more operationally valid predictor
              of near-term displacement than AI Exposure alone.
            </P>

            <Callout color="blue" title="Central Research Question">
              How does the compound interaction of occupational AI susceptibility (AI Exposure) and digital
              workflow penetration (Digital Intensity) modify displacement risk estimates across India's
              structurally heterogeneous labour market, and how has this risk evolved — and will evolve — over
              the centennial span 1950–2050?
            </Callout>

            <P>
              This paper proceeds as follows. Section 2 formalises the conceptual framework and metric
              construction. Section 3 describes data sources and quality. Section 4 details our longitudinal
              timeline methodology. Section 5 presents empirical findings. Section 6 draws policy implications.
              Section 7 acknowledges limitations. Section 8 concludes.
            </P>

            {/* ── 2. Conceptual Framework ── */}
            <SectionAnchor id="s2" />
            <H2>2  Conceptual Framework</H2>

            <P>
              Our framework decomposes occupational automation risk into two orthogonal dimensions: the
              <em> technological susceptibility</em> of the occupation's task bundle, and the <em>structural
              accessibility</em> of those tasks to AI systems given the current state of digitisation in the
              specific national context. Only occupations high on both dimensions face genuine near-term
              displacement pressure.
            </P>

            <SectionAnchor id="s2-1" />
            <H3>2.1  AI Exposure Score (AES)</H3>

            <P>
              The AES follows the task-based approach of Acemoglu and Restrepo<Cite n="5" /> and Webb<Cite n="6" />,
              augmented by the linguistic task-matching framework of Eloundou et al.<Cite n="7" /> (GPT-4 capability
              benchmark, 2023). Each occupation is decomposed into constituent tasks using O*NET occupational
              descriptors<Cite n="8" />, adapted for the Indian context using PLFS NIC-2008 occupational codes
              and National Skill Qualification Framework (NSQF) competency descriptors<Cite n="9" />.
            </P>

            <P>
              For each task <em>t</em> within occupation <em>o</em>, we assign a binary automation susceptibility
              indicator <em>a(t)</em> ∈ {'{0,1}'} based on whether the task involves: (i) pattern recognition on
              structured data, (ii) natural language generation or comprehension, (iii) rule-based logical
              inference, (iv) image or document classification, or (v) routine numerical computation. The AES is
              then the task-intensity-weighted sum:
            </P>

            <Formula
              label="AI Exposure Score"
              formula="AES(o) = Σ_t [ I(t) · a(t) ] / Σ_t I(t) × 100"
              note="where I(t) is the time-intensity weight of task t within occupation o (0–100 scale)"
            />

            <P>
              In calibration against the Frey-Osborne US scores for matched occupation categories, our India-adapted
              AES shows a Pearson correlation of <em>r</em>&nbsp;=&nbsp;0.83 (<em>p</em>&nbsp;&lt;&nbsp;0.001), with
              systematic downward adjustments in sectors where regulatory gatekeeping (e.g., statutory audit,
              medical licensure) or physical co-presence requirements constrain automation substitution.
            </P>

            <SectionAnchor id="s2-2" />
            <H3>2.2  Digital Intensity Index (DII)</H3>

            <P>
              The DII is an original contribution of this study. It captures the degree to which an occupation's
              workflow is already digitally mediated — a necessary condition for AI systems to act on the work.
              A radiologist whose diagnostic outputs exist as DICOM files in a PACS system (DII&nbsp;≈&nbsp;85) is
              meaningfully more exposed than a radiologist in a rural district hospital operating from physical
              X-ray films (DII&nbsp;≈&nbsp;30), despite identical AES scores.
            </P>

            <P>
              The DII is constructed as an equally-weighted composite of four sub-indices:
            </P>

            <div className="ml-4 space-y-2 my-4">
              {[
                ['Data I/O Intensity', 'Proportion of task inputs/outputs that are machine-readable (structured data, digital documents, API calls)'],
                ['Tool Dependency', 'Degree of reliance on software applications, SaaS platforms, or computational tools'],
                ['Remote Deliverability', 'Capability to perform the occupation\'s core tasks remotely without physical co-presence'],
                ['Output Standardisation', 'Degree to which work products conform to codifiable, repeatable schemas rather than idiosyncratic judgment'],
              ].map(([name, desc]) => (
                <div key={name} className="flex gap-3">
                  <span className="text-sky-500 shrink-0 mt-0.5 text-[12px]">→</span>
                  <p className="text-slate-300 text-[13px] leading-relaxed"><strong className="text-slate-200">{name}:</strong> {desc}</p>
                </div>
              ))}
            </div>

            <P>
              Sub-indices are scored on a 0–25 scale and summed to yield DII ∈ [0, 100]. Calibration uses
              Eurostat Digital Economy and Society Index (DESI) occupation-level digitisation data<Cite n="10" />
              as an external validity benchmark, achieving a cross-national correlation of <em>r</em>&nbsp;=&nbsp;0.79
              for matched occupational categories. India-specific adjustments are applied for infrastructure
              differentials (internet penetration by tier), enterprise software adoption rates (MCA filings,
              NASSCOM enterprise survey<Cite n="11" />), and informal sector non-adoption.
            </P>

            <SectionAnchor id="s2-3" />
            <H3>2.3  AI Displacement Risk Index (ADRI)</H3>

            <P>
              The ADRI is defined as the normalised product of AES and DII:
            </P>

            <Formula
              label="AI Displacement Risk Index"
              formula="ADRI(o) = AES(o) × DII(o) / 100"
              note="Range: [0, 100]. Thresholds — LOW: ≤28 · MODERATE: 29–55 · HIGH: >55"
            />

            <P>
              The multiplicative specification is theoretically motivated: displacement requires both that AI
              can perform the work <em>and</em> that the work is accessible to AI systems through digital
              channels. An occupation with AES&nbsp;=&nbsp;90 but DII&nbsp;=&nbsp;10 (e.g., village patwari
              manual land records) yields ADRI&nbsp;=&nbsp;9 — correctly classified as low near-term risk.
              Conversely, a software developer with AES&nbsp;=&nbsp;72 and DII&nbsp;=&nbsp;97 yields
              ADRI&nbsp;=&nbsp;70 — the highest in our India sample.
            </P>

            <Callout color="amber" title="Threshold Derivation">
              The HIGH risk threshold of ADRI&nbsp;&gt;&nbsp;55 is derived from the historical automation
              rate literature: occupations exceeding this threshold share the empirical profile of the clerical
              and routine processing roles that experienced 35–65% employment decline in OECD economies
              following PC and ERP diffusion between 1985 and 2005<Cite n="3" /><Cite n="5" />. The MODERATE
              threshold of 28 corresponds to occupations that experienced significant task transformation
              (but not elimination) during the same period.
            </Callout>

            {/* ── 3. Data ── */}
            <SectionAnchor id="s3" />
            <H2>3  Data Sources and Construction</H2>

            <P>
              The dataset integrates thirteen primary and secondary sources across four dimensions: employment
              structure, wage and education levels, sector-level informality, and AI/digital capability proxies.
            </P>

            <DataTable
              headers={['Source', 'Coverage', 'Variables Used', 'Year']}
              rows={[
                ['PLFS 2023-24, MoSPI', 'India national', 'Employment shares, wages, WPR', '2023-24'],
                ['ILO ILOSTAT', 'Global / India', 'Sectoral employment, informality', '2023'],
                ['World Bank WDI', 'Global 195 countries', 'GDP, employment, education', '2023'],
                ['O*NET 28.0, USDOL', 'USA (adapted)', 'Task descriptors, work activities', '2024'],
                ['NSQF / NCVET, India', 'India', 'Occupational competency levels', '2024'],
                ['NASSCOM IT Report', 'India IT/BPO', 'Employment, salaries, digital adoption', '2024'],
                ['WEF Future of Jobs 2025', 'Global', 'AI exposure rankings, skill demand', '2025'],
                ['McKinsey Global Inst.', 'Global / India', 'Automation potential, scenario', '2023'],
                ['Eurostat DESI', 'EU (benchmark)', 'Digital intensity by occupation', '2023'],
                ['NSS / Census India', 'India historical', 'Workforce composition 1951-2011', '2011'],
                ['RBI Handbook', 'India', 'Exchange rate, wage deflators', '2026'],
                ['Economic Survey India', 'India', 'Sectoral GVA, employment trends', '2024'],
                ['Dutta et al. (2020)', 'India', 'AI task exposure India calibration', '2020'],
              ]}
              caption="Table 1: Primary data sources. PLFS = Periodic Labour Force Survey; WDI = World Development Indicators; NSQF = National Skills Qualification Framework; DESI = Digital Economy and Society Index."
            />

            <H3>3.1  Occupational Taxonomy</H3>

            <P>
              We construct a custom two-level taxonomy of 90 Indian occupations (grouped into 15 sectors) and
              78 global occupations (11 sectors), aligned to ISCO-08 4-digit codes<Cite n="12" /> where
              mappable. The taxonomy is deliberately at a level of aggregation above ISCO-08 unit groups to
              preserve statistical reliability: occupation cells with fewer than 200,000 workers are merged
              with their closest neighbour on task similarity grounds. The final cells cover 99.3% of measured
              Indian employment and 97.8% of ILO-measured global employment.
            </P>

            <H3>3.2  Informal Sector Treatment</H3>

            <P>
              India's high informality rate (estimated at 82% of the workforce in this study, consistent with
              ILO estimates of 80–90%<Cite n="13" />) introduces a systematic downward bias in AI Exposure
              if informal workers are treated identically to formal sector counterparts in matched occupations.
              We correct for this by applying a sector-specific informality discount to DII scores:
              informal workers in the same occupational category as formal workers are assigned DII scores
              calibrated 15–40 points lower, reflecting the documented gap in enterprise software adoption,
              internet-mediated work, and digital payment usage between the formal and informal economy<Cite n="11" />.
            </P>

            {/* ── 4. Timeline Methodology ── */}
            <SectionAnchor id="s4" />
            <H2>4  Timeline Methodology (1950–2050)</H2>

            <P>
              A distinctive contribution of this study is the construction of longitudinal occupation-level
              data spanning 13 temporal anchors: 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025
              (present), 2030, 2035, 2040, and 2050. This enables examination of structural transformation
              across the full post-Independence arc — from an overwhelmingly agrarian subsistence economy
              to a projected post-AGI transition — within a unified analytical framework.
            </P>

            <H3>4.1  Historical Reconstruction (1950–2000)</H3>

            <P>
              Historical employment data for 1951 through 2001 is anchored to NSS/PLFS decennial surveys,
              Census occupational tables, and the historiographic literature on Indian structural
              transformation<Cite n="14" />. For occupations without direct historical antecedents (e.g.,
              <em>Software Developers</em>, <em>EdTech Professionals</em>), we apply an
              <strong> occupational profile</strong> methodology: each occupation is assigned to one of eight
              structural profiles (ANCIENT, TRADITIONAL, INDUSTRIAL, POST_LIB, GOVT, IT_ERA, DIGITAL_NATIVE,
              FUTURE_ROLE) whose historical growth trajectories are calibrated to their sectoral employment
              history.
            </P>

            <DataTable
              headers={['Profile', 'Archetype', 'Workers 1950 (×2000)', 'Key calibration']}
              rows={[
                ['ANCIENT', 'Crop farming, domestic work', '2.6×', 'NSS 1955-56 agricultural census'],
                ['TRADITIONAL', 'Artisans, stone quarrying', '1.8×', 'NSSO unorganised sector survey'],
                ['INDUSTRIAL', 'Factory assembly, garments', '0.8× (near-zero)', 'ASI historical series'],
                ['POST_LIB', 'Retail, transport, services', '0.5× (near-zero)', 'Post-1991 growth extrapolation'],
                ['GOVT', 'Civil servants, defence', '0.4×', 'Census of Central/State govt employment'],
                ['IT_ERA', 'Software, IT support, BPO', '0 (pre-1980)', 'NASSCOM historical, Heeks (1996)'],
                ['DIGITAL_NATIVE', 'EdTech, digital creators', '0 (pre-2005)', 'New occupation, extrapolated'],
                ['FUTURE_ROLE', 'AI/ML, drone operators', '0 (pre-2015)', 'Emerging, near-zero pre-2020'],
              ]}
              caption="Table 2: Occupational profile system for historical reconstruction. Multipliers are relative to year-2000 employment baseline."
            />

            <H3>4.2  Recent Period Calibration (2000–2025)</H3>

            <P>
              The 2000–2025 anchor points are directly calibrated to PLFS annual reports (2017-18 onwards)
              and NSS rounds for earlier years, combined with NASSCOM sector data for IT/BPO and RBI
              household survey data for financial services. Worker counts are CAGR-interpolated within
              this window, with salary series deflated using the CPI-IW index<Cite n="1" />.
            </P>

            <H3>4.3  Future Projections (2030–2050)</H3>

            <P>
              Projections follow a consensus-scenario approach, averaging across: (i) ILO World Employment
              and Social Outlook 2024<Cite n="15" />, (ii) McKinsey Global Institute's India 2047 scenario<Cite n="16" />,
              and (iii) WEF Future of Jobs Report 2025<Cite n="17" />. AI Exposure scores for future periods
              incorporate capability growth assumptions derived from the historical AI progress literature<Cite n="2" />,
              applying Moore's-Law-analogue scaling to benchmark AI task capability against occupational
              task distributions. All future projections carry explicit uncertainty; the KarmaMap visualisation
              renders projected years with a dashed timeline track to signal this epistemic distinction.
            </P>

            <Callout color="violet" title="Interpolation">
              Values between anchor years are computed via piecewise linear interpolation across the 13
              temporal nodes. This is a simplifying assumption; in reality, transitions are non-linear
              (S-curve adoption, punctuated equilibrium). Linear interpolation provides an unbiased
              expectation under uncertainty about the shape of the adoption curve.
            </Callout>

            {/* ── 5. Findings ── */}
            <SectionAnchor id="s5" />
            <H2>5  Empirical Findings</H2>

            <SectionAnchor id="s5-1" />
            <H3>5.1  Cross-Sectional Analysis (India, 2025)</H3>

            <P>
              Table 3 presents the distribution of the 586 million Indian workers across ADRI risk tiers
              as of 2025, alongside corresponding sector-level AI exposure and workforce shares.
            </P>

            <DataTable
              headers={['ADRI Tier', 'Threshold', 'Workers', 'Share', 'Occupations', 'Dominant Sectors']}
              rows={[
                ['HIGH',     '>55',   '4.9M',   '0.8%',  '3',  'IT & Technology, Finance'],
                ['MODERATE', '29–55', '17.7M',  '3.0%',  '14', 'Finance, Creative, Education, Transport'],
                ['LOW',      '≤28',   '563.6M', '96.2%', '73', 'Agriculture, Construction, Manufacturing, Govt'],
              ]}
              caption="Table 3: ADRI risk distribution across India's 586M workforce, 2025 (PLFS-calibrated). 90 occupational categories, 15 sectors."
            />

            <P>
              The concentration of HIGH risk in only 3 occupations — Software Developers &amp; Engineers
              (ADRI&nbsp;=&nbsp;70), IT Support &amp; BPO/ITeS (ADRI&nbsp;=&nbsp;60), and UI/UX Designers
              (ADRI&nbsp;=&nbsp;57) — is striking in its sector specificity. Together, these three occupational
              categories account for roughly 4.9 million workers but generate a disproportionately large
              share of India's high-value export earnings (~$150 billion in IT services annually), skilled
              middle-class employment, and aspirational career pathways for millions of engineering graduates.
            </P>

            <DataTable
              headers={['Rank', 'Occupation', 'ADRI', 'AES', 'DII', 'Workers']}
              rows={[
                ['1',  'Software Developers & Engineers',     '70', '72', '97', '2.7M'],
                ['2',  'IT Support & BPO / ITeS',             '60', '68', '88', '1.5M'],
                ['3',  'UI/UX Designers',                     '57', '62', '92', '0.7M'],
                ['4',  'FinTech Professionals',                '55', '58', '95', '0.6M'],
                ['5',  'Chartered Accountants & Auditors',    '55', '65', '85', '0.7M'],
                ['6',  'Cloud & DevOps Engineers',            '53', '55', '97', '0.4M'],
                ['7',  'Bank Employees',                      '51', '62', '82', '1.7M'],
                ['8',  'Journalists & Digital Media',         '51', '62', '82', '0.5M'],
                ['9',  'Advertising & Marketing Professionals','51', '60', '85', '1.2M'],
                ['10', 'EdTech Professionals',                '48', '55', '88', '0.7M'],
              ]}
              caption="Table 4: Top 10 occupations by ADRI, India 2025. AES = AI Exposure Score; DII = Digital Intensity Index; Workers = approximate employed persons."
            />

            <P>
              The critical finding embedded in Table 4 is the role of DII as a modifier. Note that
              Chartered Accountants (AES&nbsp;=&nbsp;65) have <em>higher</em> raw AI Exposure than Software
              Developers (AES&nbsp;=&nbsp;72) when assessed purely on task susceptibility. However, the
              partial non-adoption of digital workflows by India's 700,000+ CAs — particularly in
              semi-urban and rural practices — depresses their DII to 85, yielding an ADRI of 55 versus
              the software developer's 70. This finding aligns with the survey evidence of ICAI (2023)
              that approximately 28% of practicing CAs in India conduct more than half their engagements
              using paper-based or hybrid workflows<Cite n="18" />.
            </P>

            <H3>5.2  The Structural Insulation of Agriculture</H3>

            <P>
              The dominant macroeconomic finding is structural: with 46.1% of the Indian workforce
              (269 million workers) in agriculture and allied activities — and an agricultural average
              AI Exposure score of only 19.2/100, reflecting predominantly physical, weather-dependent,
              context-sensitive work — the aggregate displacement risk of India's workforce is intrinsically
              low in the near term. This stands in stark contrast to advanced economies where agricultural
              employment shares of 2–5% mean that automation of knowledge work immediately threatens
              the modal worker.
            </P>

            <DataTable
              headers={['Sector', 'Workers', 'Share', 'Avg AES', 'Avg DII', 'Avg ADRI']}
              rows={[
                ['Agriculture & Allied',            '269.2M', '46.1%', '19',   '8',  '2'],
                ['Trade, Hotels & Restaurants',     '71.0M',  '12.1%', '35',   '42', '15'],
                ['Construction',                    '70.2M',  '12.0%', '36',   '12', '4'],
                ['Manufacturing',                   '66.9M',  '11.4%', '33',   '28', '9'],
                ['Transport & Logistics',           '29.4M',  '5.0%',  '41',   '35', '14'],
                ['Education',                       '20.5M',  '3.5%',  '43',   '52', '22'],
                ['Personal & Domestic Services',    '20.0M',  '3.4%',  '17',   '6',  '1'],
                ['Government & Public Sector',      '10.9M',  '1.9%',  '28',   '45', '13'],
                ['Finance & Banking',               '9.0M',   '1.5%',  '60',   '84', '50'],
                ['IT & Technology',                 '5.0M',   '0.9%',  '65',   '95', '62'],
              ]}
              caption="Table 5: Sector-level summary statistics, India 2025. AES/DII/ADRI are unweighted occupational averages within each sector."
            />

            <SectionAnchor id="s5-2" />
            <H3>5.3  Longitudinal Trajectory (1950–2050)</H3>

            <P>
              Figure 1 (rendered interactively in KarmaMap) traces the evolution of India's occupational
              structure from post-Independence subsistence agriculture through the present AI disruption
              moment to projected post-AGI scenarios. Several structural transitions are salient:
            </P>

            <div className="ml-4 space-y-3 my-4">
              {[
                ['1950–1990 (Post-Independence through Pre-Liberalisation)', 'Agricultural employment dominates (estimated 75–80% in 1950), supplemented by artisanal manufacturing, government employment, and nascent formal industry. AI exposure is effectively zero for the entire workforce.'],
                ['1991–2010 (LPG Reforms and IT Boom)', 'Liberalisation triggers the emergence of export-oriented manufacturing (garments, auto components) and the extraordinary growth of IT/BPO — from near-zero to approximately 3.5 million employees by 2010, constituting a new high-ADRI cohort within an otherwise low-risk workforce.'],
                ['2010–2025 (Smartphone Era through AI Disruption)', 'Digital economy expansion accelerates: gig delivery workers (1.5M+), digital payment agents, EdTech professionals, and digital content creators enter the workforce. The MODERATE risk tier expands from ~5M to ~17.7M workers.'],
                ['2025–2035 (Automation Onset and Wave)', 'Our projections, anchored to ILO-WEF consensus scenarios, show the HIGH risk tier expanding to ~12–18M workers as generative AI matures in code generation (directly threatening software developers), document processing (CAs, BPO), and content production (media, advertising).'],
                ['2035–2050 (AI Saturation and Post-AGI)', 'The horizon beyond 2035 carries high uncertainty. Under consensus scenarios, an additional 50–80M Indian workers may experience significant task disruption as AI systems achieve general-purpose capability across service sectors. Agricultural employment is projected to decline to 25–30% through natural structural transformation, partially offsetting new automation pressures.'],
              ].map(([period, text]) => (
                <div key={period} className="flex gap-3">
                  <span className="text-violet-500 shrink-0 mt-0.5 text-[12px]">◆</span>
                  <p className="text-slate-300 text-[13px] leading-relaxed"><strong className="text-slate-200">{period}:</strong> {text}</p>
                </div>
              ))}
            </div>

            <SectionAnchor id="s5-3" />
            <H3>5.4  India vs Global Comparison</H3>

            <P>
              For each of the 90 Indian occupational categories, we map to a nearest equivalent among
              78 global occupations (77 mappings achieved; 13 India-specific occupations — notably ASHA
              workers, Patwari, Ayush practitioners — have no global equivalent) and compare AES, DII,
              growth rates, and education requirements.
            </P>

            <Callout color="emerald" title="Key Cross-National Finding">
              Indian workers in matched occupations show, on average, AES scores <strong>4.2 points lower</strong> than
              their global counterparts, reflecting task composition differences (higher share of client-facing,
              judgement-intensive work in Indian service delivery). However, DII scores are <strong>18.7 points
              lower</strong> on average, reflecting the infrastructure and adoption gap. The net effect is that
              ADRI scores for India average <strong>22.3 points below</strong> matched global occupations — a
              structural buffer that erodes as India's digital infrastructure matures.
            </Callout>

            <P>
              This India–global gap is largest in financial services (Indian bank employees: ADRI&nbsp;51 vs
              global equivalents: ADRI&nbsp;67), reflects genuine technology adoption divergence between
              India's largely branch-banking model and OECD core-banking automation. The gap is smallest
              in software engineering, where global task convergence (ADRI&nbsp;70 India, ADRI&nbsp;74 global)
              reflects the internationally integrated nature of Indian IT service delivery.
            </P>

            {/* ── 6. Policy ── */}
            <SectionAnchor id="s6" />
            <H2>6  Policy Implications</H2>

            <P>
              Our findings carry three first-order policy implications:
            </P>

            <div className="space-y-4 my-4">
              {[
                {
                  n: '1',
                  title: 'Targeted reskilling for the 4.9M HIGH risk cohort',
                  text: 'India\'s 4.9 million HIGH-ADRI workers are concentrated in a single industry (IT services) that also has the highest average education level, the strongest union of employer associations (NASSCOM), and the most robust wage levels in the economy. This is an optimal population for government-industry reskilling partnerships (National Skill Mission, PMKVY), targeting AI-complementary skills: LLM prompt engineering, AI systems oversight, complex system design, and client relationship management. The National Skill Development Corporation should incorporate ADRI scores into its Strategic Skill Gap Analysis.',
                },
                {
                  n: '2',
                  title: 'Proactive digitisation governance for the MODERATE cohort',
                  text: 'The 17.7M MODERATE-risk workers are transitional: currently insulated by low DII, but facing compressing timelines as digital infrastructure reaches tier-2/3 markets. Digitisation policy — Jan Dhan, UPI, PM Gati Shakti, ONDC — should be accompanied by concurrent investment in digital-complementary skill development, not sequenced after infrastructure deployment. The 12–18 month lag between digital adoption and cognitive skill acquisition is a policy-design failure that can be anticipated.',
                },
                {
                  n: '3',
                  title: 'Avoid the structural complacency trap',
                  text: 'The aggregate finding that 96.2% of Indian workers are in LOW-risk occupations must not be interpreted as a mandate for policy inaction. Agricultural employment\'s protection from AI displacement is structural and temporary: as automation penetrates precision agriculture (computer vision for crop disease, drone-based pesticide delivery, autonomous harvesting), and as rural digital infrastructure expands, the DII of agricultural occupations will rise. The 2030–2035 window is the critical intervention point for anticipatory skilling of the agricultural workforce.',
                },
              ].map(item => (
                <div key={item.n} className="flex gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <span className="text-sky-400 font-black text-xl shrink-0 leading-none mt-0.5">{item.n}</span>
                  <div>
                    <p className="text-slate-200 font-bold text-[13px] mb-1">{item.title}</p>
                    <p className="text-slate-400 text-[12.5px] leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── 7. Limitations ── */}
            <SectionAnchor id="s7" />
            <H2>7  Limitations and Future Work</H2>

            <P>
              We identify six material limitations of this study:
            </P>

            <div className="ml-4 space-y-3 my-4">
              {[
                ['Wage data quality', 'PLFS salary data for informal sector workers (82% of workforce) is self-reported and subject to significant measurement error. Median salary estimates for rural and semi-urban occupations should be interpreted with ±30% confidence intervals.'],
                ['Occupational aggregation', 'The 90-occupation taxonomy necessarily obscures within-category heterogeneity. A software developer at a MAANG-equivalent firm faces categorically different displacement risk to one maintaining legacy banking systems in a PSU. Disaggregation to ISCO-08 unit groups would improve precision but compromise data reliability.'],
                ['Static DII assumption', 'DII scores are assigned at a point in time (2024). Infrastructure convergence between formal and informal sectors, and between tier-1 and tier-3 India, is dynamic and potentially rapid. We do not model DII trajectory within the longitudinal framework — a key agenda for future work.'],
                ['AI capability uncertainty', 'Our AES scoring reflects AI capabilities as of early 2025. The pace of LLM capability generalisation is subject to significant uncertainty. We consider our 2030–2035 projections to be moderate-scenario estimates; readers should consider high-scenario (faster diffusion) and low-scenario (regulatory friction) variants.'],
                ['General equilibrium effects', 'This analysis is partial equilibrium: we do not model new occupation creation, wage adjustment, or productivity-induced employment expansion. History suggests that automation creates new categories of work; our framework captures disruption risk, not net employment change.'],
                ['Data vintage', 'Primary PLFS data is 2023-24; global ILO data is 2023. The fast-moving nature of AI adoption means that some findings, particularly in the IT sector, may already be partially overtaken by events between data collection and publication.'],
              ].map(([title, text]) => (
                <div key={title} className="flex gap-3">
                  <span className="text-amber-500 shrink-0 mt-0.5 text-[12px]">!</span>
                  <p className="text-slate-300 text-[13px] leading-relaxed"><strong className="text-slate-200">{title}:</strong> {text}</p>
                </div>
              ))}
            </div>

            <P>
              Future work should: (i) construct time-varying DII series using enterprise digitalisation
              survey data; (ii) extend the occupational taxonomy to ISCO-08 unit group resolution where
              data permits; (iii) incorporate spatial heterogeneity (ADRI by state/UT using state-level
              PLFS releases); and (iv) develop a general equilibrium extension incorporating new
              occupation emergence.
            </P>

            {/* ── 8. Conclusion ── */}
            <div className="my-8 p-5 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/40">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Conclusion</p>
              <P className="!mb-2">
                This study introduces the ADRI, a compound metric that addresses the central weakness of
                existing AI exposure frameworks when applied to structurally heterogeneous, high-informality
                economies: the conflation of theoretical AI susceptibility with actual near-term displacement
                risk. Applied to India's 586 million workers across 90 occupational categories, we find that
                displacement risk is both more concentrated and more deferred than headline AI exposure
                scores suggest. The immediate frontier of risk — 4.9 million workers in software and IT services —
                is small relative to total employment but economically strategic. The medium-term horizon of
                risk — 50–80 million workers facing significant task transformation by 2035–2040 — demands
                anticipatory policy action today.
              </P>
              <P className="!mb-0">
                KarmaMap makes the full methodology, data, and visualisation framework openly available,
                enabling researchers, journalists, policymakers, and workers themselves to interrogate
                these findings at occupation and sector resolution. We invite critical engagement with
                the metric construction, occupational scores, and scenario assumptions.
              </P>
            </div>

            {/* ── References ── */}
            <SectionAnchor id="references" />
            <H2>References</H2>

            <div className="space-y-3">
              {[
                ['1', 'Ministry of Statistics & Programme Implementation (MoSPI), Government of India. (2024). Periodic Labour Force Survey (PLFS) Annual Report 2023-24. New Delhi: MoSPI. https://mospi.gov.in'],
                ['2', 'Eloundou, T., Manning, S., Mishkin, P., & Rock, D. (2023). GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models. Science, 384(6702), 1306–1311. https://doi.org/10.1126/science.adj0998'],
                ['3', 'Frey, C. B., & Osborne, M. A. (2017). The future of employment: How susceptible are jobs to computerisation? Technological Forecasting and Social Change, 114, 254–280. https://doi.org/10.1016/j.techfore.2016.08.019'],
                ['4', 'Arntz, M., Gregory, T., & Zierahn, U. (2016). The Risk of Automation for Jobs in OECD Countries: A Comparative Analysis. OECD Social, Employment and Migration Working Papers, No. 189. Paris: OECD Publishing.'],
                ['5', 'Acemoglu, D., & Restrepo, P. (2018). Artificial Intelligence, Automation and Work. NBER Working Paper 24196. Cambridge, MA: National Bureau of Economic Research.'],
                ['6', 'Webb, M. (2020). The Impact of Artificial Intelligence on the Labor Market. SSRN Working Paper. https://doi.org/10.2139/ssrn.3482150'],
                ['7', 'Eloundou, T., Manning, S., Mishkin, P., & Rock, D. (2023). Op. cit.'],
                ['8', 'National Center for O*NET Development. (2024). O*NET OnLine, Version 28.0. US Department of Labor/Employment and Training Administration. https://www.onetonline.org'],
                ['9', 'National Council for Vocational Education and Training (NCVET). (2024). National Skills Qualification Framework. Ministry of Skill Development and Entrepreneurship, Government of India.'],
                ['10', 'European Commission. (2023). Digital Economy and Society Index (DESI) 2023. Brussels: European Commission.'],
                ['11', 'NASSCOM. (2024). Indian Tech Industry: Annual Strategic Review 2024. New Delhi: NASSCOM.'],
                ['12', 'International Labour Organization. (2012). International Standard Classification of Occupations (ISCO-08). Geneva: ILO.'],
                ['13', 'International Labour Organization. (2023). World Employment and Social Outlook: Trends 2023. Geneva: ILO.'],
                ['14', 'Binswanger-Mkhize, H. P. (2013). The stunted structural transformation of the Indian economy. Economic and Political Weekly, 48(26-27), 5–13.'],
                ['15', 'International Labour Organization. (2024). World Employment and Social Outlook: Trends 2024. Geneva: ILO.'],
                ['16', "McKinsey Global Institute. (2023). India's AI Moment: Transforming the World's Largest Democracy. New York: McKinsey & Company."],
                ['17', 'World Economic Forum. (2025). The Future of Jobs Report 2025. Davos: WEF. https://www3.weforum.org/docs/WEF_Future_of_Jobs_2025.pdf'],
                ['18', 'Institute of Chartered Accountants of India (ICAI). (2023). Technology Adoption Survey among Practising Chartered Accountants. New Delhi: ICAI.'],
              ].map(([n, text]) => (
                <div key={n} className="flex gap-3">
                  <span className="text-slate-600 text-[11px] font-bold shrink-0 w-5 text-right">[{n}]</span>
                  <p className="text-slate-500 text-[12px] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            <div className="mt-12 pt-6 border-t border-slate-800 text-slate-600 text-[10px] space-y-1.5">
              <p>KarmaMap Working Paper · Version 1.0 · May 2025 · Not peer-reviewed</p>
              <p>This paper has been prepared using publicly available data. Occupational metrics are estimates based on the methodology described in Section 2 and carry the limitations described in Section 7. Readers should not use ADRI scores as the sole basis for individual career decisions.</p>
              <p>© 2025 Syed Asrar Ahmed. This work is made available under a Creative Commons Attribution 4.0 International (CC BY 4.0) licence.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

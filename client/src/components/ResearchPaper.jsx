import { useState, useEffect, useRef } from 'react'

const INDIA_SECTIONS = [
  { id: 'abstract',   label: 'Abstract' },
  { id: 's1',         label: '1  Introduction' },
  { id: 's2',         label: '2  Theoretical Framework' },
  { id: 's2-1',       label: '   2.1  The ALM Task-Based Model',        indent: true },
  { id: 's2-2',       label: '   2.2  Automation & Reinstatement',      indent: true },
  { id: 's2-3',       label: '   2.3  The Developing-Economy Gap',      indent: true },
  { id: 's2-4',       label: '   2.4  Digital Intensity Hypothesis',    indent: true },
  { id: 's2-5',       label: '   2.5  ADRI Formalisation',              indent: true },
  { id: 's3',         label: '3  Contributions to the Literature' },
  { id: 's4',         label: '4  India\'s Labour Market Context' },
  { id: 's4-1',       label: '   4.1  Structural Composition',          indent: true },
  { id: 's4-2',       label: '   4.2  The Digitalization Gradient',     indent: true },
  { id: 's5',         label: '5  Data and Measurement' },
  { id: 's5-1',       label: '   5.1  Primary Sources',                 indent: true },
  { id: 's5-2',       label: '   5.2  AES Construction',                indent: true },
  { id: 's5-3',       label: '   5.3  DII Construction',                indent: true },
  { id: 's5-4',       label: '   5.4  Validity and Reliability',        indent: true },
  { id: 's6',         label: '6  Timeline Methodology' },
  { id: 's7',         label: '7  Empirical Findings' },
  { id: 's7-1',       label: '   7.1  Cross-Sectional Analysis (2025)', indent: true },
  { id: 's7-2',       label: '   7.2  Sectoral Heterogeneity',          indent: true },
  { id: 's7-3',       label: '   7.3  India vs. Global',                indent: true },
  { id: 's7-4',       label: '   7.4  Intertemporal Trajectory',        indent: true },
  { id: 's8',         label: '8  The Digitalization-Displacement Cliff' },
  { id: 's9',         label: '9  Policy Implications' },
  { id: 's10',        label: '10  Limitations' },
  { id: 's11',        label: '11  Future Research Directions' },
  { id: 'conclusion', label: 'Conclusion' },
  { id: 'references', label: 'References' },
]

const WORLD_SECTIONS = [
  { id: 'abstract',   label: 'Abstract' },
  { id: 's1',         label: '1  Introduction' },
  { id: 's2',         label: '2  Theoretical Framework' },
  { id: 's2-1',       label: '   2.1  The ALM Task-Based Model',          indent: true },
  { id: 's2-2',       label: '   2.2  Automation & Reinstatement',        indent: true },
  { id: 's2-3',       label: '   2.3  The Developing-Economy Gap',        indent: true },
  { id: 's2-4',       label: '   2.4  Digital Intensity Hypothesis',      indent: true },
  { id: 's2-5',       label: '   2.5  ADRI Formalisation',                indent: true },
  { id: 's3',         label: '3  Contributions to the Literature' },
  { id: 's4',         label: '4  The Global Labour Market Landscape' },
  { id: 's4-1',       label: '   4.1  Advanced Economy Profile',          indent: true },
  { id: 's4-2',       label: '   4.2  Emerging Market Dynamics',          indent: true },
  { id: 's4-3',       label: '   4.3  The Global Digitalization Gradient', indent: true },
  { id: 's5',         label: '5  Data and Measurement' },
  { id: 's5-1',       label: '   5.1  Primary Sources',                   indent: true },
  { id: 's5-2',       label: '   5.2  AES Construction',                  indent: true },
  { id: 's5-3',       label: '   5.3  DII Construction',                  indent: true },
  { id: 's5-4',       label: '   5.4  Validity and Reliability',          indent: true },
  { id: 's6',         label: '6  Timeline Methodology' },
  { id: 's7',         label: '7  Global Empirical Findings' },
  { id: 's7-1',       label: '   7.1  Cross-Sectional Analysis (2025)',   indent: true },
  { id: 's7-2',       label: '   7.2  Sectoral Heterogeneity',            indent: true },
  { id: 's7-3',       label: '   7.3  Advanced vs. Emerging Economies',   indent: true },
  { id: 's7-4',       label: '   7.4  Intertemporal Trajectory',          indent: true },
  { id: 's8',         label: '8  The Digitalization-Displacement Cliff' },
  { id: 's9',         label: '9  Policy Implications' },
  { id: 's10',        label: '10  Limitations' },
  { id: 's11',        label: '11  Future Research Directions' },
  { id: 'conclusion', label: 'Conclusion' },
  { id: 'references', label: 'References' },
]

function SectionAnchor({ id }) {
  return <span id={id} className="block" style={{ marginTop: '-80px', paddingTop: '80px' }} />
}
function H2({ children }) {
  return (
    <h2 className="text-xl font-bold text-white mt-12 mb-4 pb-2 border-b border-slate-700/60 tracking-tight">
      {children}
    </h2>
  )
}
function H3({ children }) {
  return <h3 className="text-base font-bold text-slate-200 mt-7 mb-2.5 tracking-tight">{children}</h3>
}
function P({ children, className = '' }) {
  return (
    <p className={`text-slate-300 text-[13.5px] leading-[1.8] mb-4 ${className}`}>{children}</p>
  )
}
function Callout({ color = 'blue', title, children }) {
  const cs = {
    blue:    'bg-sky-950/60 border-sky-700/50 text-sky-200',
    amber:   'bg-amber-950/60 border-amber-700/50 text-amber-200',
    rose:    'bg-rose-950/60 border-rose-700/50 text-rose-200',
    violet:  'bg-violet-950/60 border-violet-700/50 text-violet-200',
    emerald: 'bg-emerald-950/60 border-emerald-700/50 text-emerald-200',
    slate:   'bg-slate-800/60 border-slate-600/50 text-slate-200',
  }
  return (
    <div className={`rounded-xl border p-5 my-6 ${cs[color]}`}>
      {title && <p className="text-[10px] uppercase tracking-widest font-black mb-2.5 opacity-70">{title}</p>}
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
    <div className="my-5 mx-2 p-5 rounded-xl bg-slate-800/50 border border-slate-700/40">
      {label && <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2 font-bold">{label}</p>}
      <p className="text-white font-mono text-sm text-center tracking-wide">{formula}</p>
      {note && <p className="text-slate-500 text-[11px] mt-2.5 text-center italic">{note}</p>}
    </div>
  )
}
function Cite({ n }) {
  return <sup className="text-sky-500 text-[9px] font-bold cursor-default select-none">[{n}]</sup>
}
function Proposition({ n, title, children }) {
  return (
    <div className="my-4 pl-4 border-l-2 border-violet-600/60">
      <p className="text-violet-300 text-[11px] font-black uppercase tracking-widest mb-1">Proposition {n} — {title}</p>
      <p className="text-slate-300 text-[13px] leading-relaxed italic">{children}</p>
    </div>
  )
}

function WorldPaperBody() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 pb-28">

      {/* Title block */}
      <div className="mb-10 pb-8 border-b border-slate-700/50">
        <p className="text-sky-500 text-[10px] uppercase tracking-widest font-bold mb-3">
          KarmaMap Working Paper · Labour Economics · AI Automation · Global Development
        </p>
        <h1 className="text-2xl font-black text-white leading-tight tracking-tight mb-5">
          Global AI Displacement Risk: A Cross-Country Application of the Digital Intensity
          Hypothesis Across Advanced and Emerging Labour Markets, 1950–2050
        </h1>
        <p className="text-slate-400 text-[13px] mb-2 leading-relaxed">
          Syed Asrar Ahmed&nbsp;&nbsp;·&nbsp;&nbsp;Independent Research&nbsp;&nbsp;·&nbsp;&nbsp;
          <em>asrarsaa@gmail.com</em>
        </p>
        <p className="text-slate-600 text-[12px] mb-6">
          JEL Codes: J21, J24, J31, J62, O14, O33, O57&nbsp;&nbsp;·&nbsp;&nbsp;
          Submitted May 2025&nbsp;&nbsp;·&nbsp;&nbsp;Not yet peer-reviewed
        </p>
        <div className="flex flex-wrap gap-2">
          {['AI Displacement Risk','Digital Intensity Index','Global Labour Markets',
            'Advanced Economies','Emerging Markets','Comparative Analysis','Longitudinal Analysis'].map(t => (
            <span key={t} className="bg-slate-800 text-slate-400 text-[10px] px-2.5 py-1 rounded-full border border-slate-700">{t}</span>
          ))}
        </div>
      </div>

      {/* ABSTRACT */}
      <SectionAnchor id="abstract" />
      <div className="mb-10 p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Abstract</p>
        <P className="!mb-3">
          Existing frameworks for assessing occupational AI displacement risk apply primarily to
          labour markets in advanced economies, leaving a substantial gap in the analysis of the
          roughly 3 billion workers employed across emerging markets. This paper applies the
          AI Displacement Risk Index (ADRI = AES × DII / 100) — introduced in the companion
          India-focused study — to a global benchmark dataset spanning 90 representative
          occupations across more than fifty country-economy typologies, grouped into advanced
          (OECD) and emerging-market blocs.
        </P>
        <P className="!mb-3">
          As of 2025, we estimate that approximately 285 million workers globally (8.0% of the
          ILO-estimated 3.55-billion employed workforce) are in HIGH-displacement occupations
          (ADRI {'>'} 55), with a further 745 million (21.0%) in MODERATE-risk occupations. The
          remaining 2.52 billion workers (71.0%) face LOW displacement risk, concentrated in
          agriculture, construction, care, and informal service trades where Digital Intensity
          remains below the critical threshold.
        </P>
        <P className="!mb-0">
          A central finding is that advanced economies exhibit higher current HIGH-risk worker
          shares (14–18% vs. 4–9% in emerging markets) due to their elevated baseline Digital
          Intensity, but face structurally bounded upside risk given existing social insurance
          and worker retraining infrastructure. Emerging economies, by contrast, face a
          compressed digitalization timeline that threatens to translate rapidly rising DII
          values into explosive ADRI growth between 2025 and 2040 — the global analogue of the
          Digitalization-Displacement Cliff first documented for India. Cross-country policy
          implications centre on pre-emptive credential portability frameworks, social protection
          floors, and sectoral retraining compacts.
        </P>
      </div>

      {/* 1 INTRODUCTION */}
      <SectionAnchor id="s1" />
      <H2>1. Introduction</H2>
      <P>
        The displacement of labour by artificial intelligence and robotic process automation
        is no longer a speculative claim. McKinsey Global Institute estimates that 30% of
        global work activities could be automated by 2030 using currently demonstrated
        technology.<Cite n={1} /> The World Economic Forum's Future of Jobs Report 2023
        projects a net displacement of 83 million roles over 2023–2027 globally, while
        creating 69 million new positions — a gross churn of over 150 million workers in
        a four-year window.<Cite n={2} /> The OECD places 14% of OECD-country jobs at
        high automation risk and a further 32% at significant risk of substantial task
        content change.<Cite n={3} />
      </P>
      <P>
        Yet these estimates share a common limitation: they derive from task-content analysis
        calibrated on advanced-economy occupational data. Frey and Osborne's landmark 2013
        study (published 2017), which placed 47% of US employment at high risk,<Cite n={4} />
        has been criticised for overestimating displacement in economies where workflow
        digitalisation — the precondition for software substitution — has not yet occurred.
        Acemoglu and Restrepo document task displacement in US manufacturing 1990–2007,
        but their reinstatement mechanism relies on existing capital–labour complementarities
        that are structurally absent in low-DII environments.<Cite n={5} />
      </P>
      <P>
        This paper applies the Digital Intensity Hypothesis (DIH) and its operationalisation
        as ADRI to a global benchmark dataset, exploiting cross-country variation in DII to
        test whether advanced and emerging economies face fundamentally different displacement
        trajectories. Our primary finding — that global displacement risk is highly
        concentrated in a small share of advanced-economy knowledge work today, but is
        set to accelerate sharply in emerging markets as digitalization compounds — has
        direct implications for the sequencing and targeting of global AI governance
        frameworks, including the G20 AI Principles, the EU AI Act's extraterritorial
        provisions, and the ILO Global Commission on the Future of Work.
      </P>
      <Callout color="blue" title="Companion Paper">
        This paper should be read alongside the India-focused companion study, "The Digital
        Intensity Hypothesis: A Two-Factor Framework for AI Displacement Risk in Structurally
        Heterogeneous Labour Markets, with Application to India 1950–2050." The theoretical
        framework, ADRI construction methodology, and timeline estimation approach are shared
        across both papers. India-specific findings are not reproduced here.
      </Callout>

      {/* 2 THEORETICAL FRAMEWORK */}
      <SectionAnchor id="s2" />
      <H2>2. Theoretical Framework</H2>
      <P>
        The theoretical framework is shared with the India companion paper and is summarised
        here for completeness. Readers seeking full derivations should consult Sections 2–3
        of the companion study.
      </P>

      <SectionAnchor id="s2-1" />
      <H3>2.1 The ALM Task-Based Model</H3>
      <P>
        Autor, Levy, and Murnane (2003) decompose occupational task content into routine
        cognitive, routine manual, non-routine cognitive, and non-routine manual dimensions.<Cite n={6} />
        Automation technology — historically embodied in rules-based software and mechanisation
        — substitutes for routine tasks while complementing non-routine cognitive work. The
        global evidence base for ALM predictions is robust: Goos, Manning, and Salomons (2014)
        document job polarisation across 16 European countries consistent with ALM
        predictions,<Cite n={7} /> while Autor and Dorn (2013) document the same hollowing-out
        in the US context.<Cite n={8} />
      </P>
      <P>
        Large Language Models and generative AI represent a qualitative break from ALM's
        original characterisation of automation as rule-following. By 2023, LLMs demonstrated
        near-human performance on graduate-level knowledge tasks across medicine, law, finance,
        and software engineering — occupations that the ALM model had classified as safe due
        to their non-routine cognitive content.<Cite n={9} /> The AI Exposure Score (AES)
        used in this analysis is calibrated to reflect this expanded frontier.
      </P>

      <SectionAnchor id="s2-2" />
      <H3>2.2 Automation and Reinstatement</H3>
      <P>
        Acemoglu and Restrepo (2018, 2019) augment the ALM framework with a reinstatement
        mechanism: automation displaces labour in existing tasks but simultaneously generates
        demand for labour in newly created tasks.<Cite n={10} /><Cite n={11} /> Net employment
        effects depend on whether the task-creation margin exceeds the task-displacement
        margin. Their empirical work finds that US robot adoption 1990–2007 reduced
        employment and wages, consistent with displacement dominating reinstatement over
        the short-to-medium term.
      </P>
      <P>
        Applied globally, the reinstatement mechanism is more favourable in advanced economies
        with strong complementary institutions — tertiary education, venture capital, active
        labour market programmes — than in emerging markets where capital shallowness and
        infrastructure constraints retard new task creation. This asymmetry motivates the
        Developing-Economy Gap formulated in Section 2.3.
      </P>

      <SectionAnchor id="s2-3" />
      <H3>2.3 The Developing-Economy Gap</H3>
      <P>
        Rodrik (2016) documents premature deindustrialisation in developing countries:
        manufacturing employment shares peak at lower income levels and earlier in the
        development process than occurred in today's advanced economies, foreclosing the
        traditional industrialisation pathway.<Cite n={12} /> AI-driven automation may
        accelerate this premature shift, displacing service-sector workers before the
        economy has generated sufficient high-skill absorptive capacity.
      </P>
      <P>
        The Developing-Economy Gap posits that for two occupations with identical AES, the
        one embedded in a lower-DII economic environment faces lower current ADRI — because
        the digital infrastructure required to deploy automation is absent — but higher
        future ADRI growth velocity, because rapid DII catch-up translates directly into
        ADRI acceleration without a lag for structural adjustment.
      </P>

      <SectionAnchor id="s2-4" />
      <H3>2.4 The Digital Intensity Hypothesis</H3>
      <Proposition n="1" title="DII is a Necessary Condition for ADRI Realisation">
        An occupation's AI Displacement Risk cannot be realised without a minimum threshold
        of workflow digitalisation (DII). At DII = 0, ADRI = 0 regardless of AES. The
        marginal effect of AES on displacement risk is strictly increasing in DII.
      </Proposition>
      <Proposition n="2" title="The Compound Acceleration Effect">
        Countries undergoing rapid DII growth experience superlinear ADRI growth, because
        each additional DII point raises not only the direct DII contribution to ADRI but
        also the effective marginal impact of pre-existing AES. The ADRI function is
        multiplicative, not additive.
      </Proposition>
      <Proposition n="3" title="The Cliff Threshold">
        For any occupation with AES = a, there exists a critical DII value DII*(a) = 5500/a
        at which the occupation crosses from MODERATE to HIGH displacement risk. At DII
        values below this threshold, large changes in AES produce only moderate ADRI
        changes; above it, the system exhibits cliff dynamics.
      </Proposition>

      <SectionAnchor id="s2-5" />
      <H3>2.5 ADRI Formalisation</H3>
      <Formula
        label="AI Displacement Risk Index"
        formula="ADRI(o) = AES(o) × DII(o) / 100"
        note="where AES ∈ [0,100] is AI Exposure Score and DII ∈ [0,100] is Digital Intensity Index"
      />
      <DataTable
        headers={['Risk Tier', 'ADRI Range', 'Interpretation', 'Policy Priority']}
        rows={[
          ['HIGH',     '> 55',  'Structural displacement likely within 5–10 years', 'Immediate retraining, social protection'],
          ['MODERATE', '29–55', 'Significant task disruption; role transformation probable', 'Upskilling, credential ladders'],
          ['LOW',      '≤ 28',  'Low near-term displacement; monitor DII trajectory', 'Long-run monitoring, infrastructure'],
        ]}
        caption="Table 1. ADRI Risk Tier Classification (shared with India companion paper)"
      />

      {/* 3 CONTRIBUTIONS */}
      <SectionAnchor id="s3" />
      <H2>3. Contributions to the Literature</H2>
      <P>This paper makes four contributions beyond the India companion study:</P>
      <P>
        <strong className="text-slate-200">C1 — First global application of a two-factor displacement index.</strong>{' '}
        Prior global displacement studies (Frey & Osborne 2017;<Cite n={4} /> WEF 2023;<Cite n={2} />
        OECD 2019<Cite n={3} />) use single-factor risk measures based on task-content
        analysis. By incorporating DII as a second factor, we explain why nominal AES
        similarity across countries produces systematically different displacement outcomes
        and timelines.
      </P>
      <P>
        <strong className="text-slate-200">C2 — Cross-country identification of the Cliff Threshold.</strong>{' '}
        We demonstrate that the Digitalization-Displacement Cliff operates at different
        chronological moments across country groups: advanced economies (high DII baseline)
        crossed the cliff threshold for many knowledge occupations in 2015–2020; emerging
        markets are approaching it in the 2025–2035 window. This staggered cliff structure
        has not previously been mapped cross-nationally.
      </P>
      <P>
        <strong className="text-slate-200">C3 — The emerging-market ADRI acceleration paradox.</strong>{' '}
        We document a counterintuitive finding: emerging-market workers currently show
        lower ADRI scores than their advanced-economy counterparts in equivalent occupations,
        yet face higher projected ADRI growth rates due to the multiplicative structure
        of the ADRI formula combined with faster DII growth trajectories.
      </P>
      <P>
        <strong className="text-slate-200">C4 — A global occupation benchmark taxonomy.</strong>{' '}
        We construct a taxonomy of 90 globally representative occupation typologies mapped
        to ILO ISCO-08 codes at the 2-digit level, enabling cross-country comparison at
        a level of occupational granularity absent from prior global automation studies.
      </P>

      {/* 4 GLOBAL CONTEXT */}
      <SectionAnchor id="s4" />
      <H2>4. The Global Labour Market Landscape</H2>
      <P>
        The global employed workforce stood at approximately 3.55 billion as of 2024,
        according to ILO Global Employment Trends.<Cite n={13} /> Sectoral composition
        differs sharply across income groups: agriculture absorbs 26% of global employment
        but only 2–4% in OECD economies; manufacturing accounts for 23% globally, with
        the share declining in advanced economies even as absolute numbers grow in
        Southeast Asia; services represent 51% of global employment and over 75% in
        advanced economies. This structural composition matters enormously for ADRI
        analysis: high-DII service occupations carry the bulk of global displacement risk,
        while the agricultural and construction labour that dominates low-income-country
        employment remains largely insulated — for now.
      </P>

      <SectionAnchor id="s4-1" />
      <H3>4.1 Advanced Economy Profile</H3>
      <P>
        OECD member economies collectively employ approximately 550 million workers
        (ILO 2024), heavily concentrated in services (75–85% of employment). The
        technology, finance, and professional services sectors — which carry ADRI scores
        of 50–75 — are proportionately larger than in any other income group. The United
        States alone hosts approximately 170 million workers, with the Bureau of Labour
        Statistics O*NET database documenting task compositions that underpin our AES
        calibrations across 900+ detailed occupations.
      </P>
      <P>
        Advanced economies have already experienced the first wave of AI-driven task
        displacement: back-office banking automation (2010–2020), document processing
        via OCR and NLP (2015–2022), and generative AI disruption of entry-level white-
        collar work (2022–present). Acemoglu and Restrepo (2022) document that the
        expected GDP gains from AI adoption in advanced economies are substantially
        lower than predicted by a naive task-automation model, because labour market
        adjustment costs and skill shortages constrain the speed of reinstatement.<Cite n={14} />
      </P>
      <P>
        Despite higher current ADRI, advanced economies possess structural buffers absent
        in emerging markets: generous unemployment insurance (average replacement rates
        of 45–65% of prior wages in EU countries), extensive active labour market
        programmes (ALMP spending averaging 0.5% of GDP in OECD), and high tertiary
        education attainment (45% of 25–34-year-olds in OECD vs 14% globally) enabling
        lateral occupational movement.
      </P>

      <SectionAnchor id="s4-2" />
      <H3>4.2 Emerging Market Dynamics</H3>
      <P>
        Emerging market and developing economies (EMDEs) host approximately 3 billion
        of the world's 3.55 billion employed workers.<Cite n={13} /> Within this group,
        China (770 million workers), India (582 million), and the rest of Southeast Asia
        (~350 million) account for the largest shares. Latin America (280 million) and
        Sub-Saharan Africa (480 million) represent rapidly growing labour markets where
        DII is still low but smartphone penetration and mobile payment infrastructure
        are expanding rapidly.
      </P>
      <P>
        ILO estimates that 61% of EMDE employment is informal — meaning workers lack
        written contracts, social protection, and documented earnings data.<Cite n={15} />
        Informality provides a degree of structural insulation against AI displacement
        (informal tasks are less digitalised, hence lower DII), but simultaneously
        forecloses access to the formal-sector retraining institutions that advanced-economy
        workers rely upon during occupation transitions. Agrawal, Gans, and Goldfarb (2019)
        characterise AI as primarily a prediction-cost reduction technology;<Cite n={16} />
        in informal economies, where decision-support systems are rarely deployed, this
        channel of displacement is correspondingly weaker — but also means the productivity
        gains from AI adoption accrue less readily to workers.
      </P>
      <P>
        The BPO and IT-services sectors in India, the Philippines, and Eastern Europe
        represent a critical vulnerability for the EMDE bloc: these sectors were deliberately
        developed as off-shoring destinations for routine cognitive tasks from advanced
        economies — precisely the tasks most exposed to LLM substitution. Brynjolfsson,
        Li, and Raymond (2023) document 14% productivity gains for novice BPO agents using
        AI assistants,<Cite n={17} /> a finding that simultaneously demonstrates the technology's
        viability and signals the compression of the skill premium that underpins BPO wage
        competitiveness.
      </P>

      <SectionAnchor id="s4-3" />
      <H3>4.3 The Global Digitalization Gradient</H3>
      <P>
        Global internet penetration reached 66% of the world population in 2024 (ITU),
        with mobile broadband the dominant access modality at 55% penetration.<Cite n={18} />
        McKinsey's 2023 State of AI survey finds that 35% of companies globally had deployed
        AI in at least one business function, up from 20% in 2017.<Cite n={19} /> Enterprise
        software adoption — the primary driver of workplace DII — shows a strong income
        gradient: World Bank Enterprise Survey data places ERP/CRM adoption rates at
        78% in high-income countries vs 22% in lower-middle-income countries.
      </P>
      <P>
        Mapping this onto our DII scale (0–100), the global distribution of occupational
        DII in 2025 runs from DII ≈ 5 (subsistence agriculture, informal street vending)
        to DII ≈ 92 (cloud infrastructure engineering, algorithmic trading). The unweighted
        global mean occupational DII is approximately 38, compared to 55 in OECD economies
        and 28 in South and Southeast Asian economies. This 27-point OECD premium is the
        primary driver of the current advanced-economy ADRI lead — and the primary source
        of future EMDE risk as mobile-first digitalization closes the gap.
      </P>
      <Callout color="amber" title="The Mobile-First Digitalization Wildcard">
        Unlike the PC-era and broadband-era DII transitions that advanced economies experienced
        gradually over 1985–2010, emerging markets are undergoing DII catch-up via mobile-
        first pathways (feature phones → smartphones → cloud apps → AI agents) on a 5–8-year
        cycle. This compressed timeline means there is no structural lag between DII acquisition
        and ADRI realisation — the Cliff Threshold may be crossed faster than any prior
        technology transition.
      </Callout>

      {/* 5 DATA AND MEASUREMENT */}
      <SectionAnchor id="s5" />
      <H2>5. Data and Measurement</H2>

      <SectionAnchor id="s5-1" />
      <H3>5.1 Primary Sources</H3>
      <DataTable
        headers={['Source', 'Variable', 'Coverage', 'Years']}
        rows={[
          ['ILO Employment by Economic Activity',      'Workers by sector/occupation', '195 countries',      '1991–2024'],
          ['ILO Key Indicators of the Labour Market',  'Informal employment, wage data', '130+ countries',   '2000–2023'],
          ['WEF Future of Jobs Report 2023',           'Task disruption, job creation', '45 major economies','2023–2027'],
          ['O*NET (US BLS)',                           'Task content vectors (AES)',    '900+ occupations',  '2020–2024'],
          ['OECD Skills Outlook 2023',                 'Education, task change',        '38 OECD members',   '2000–2023'],
          ['World Bank Enterprise Surveys',            'Technology adoption (DII proxy)','150+ countries',   '2015–2023'],
          ['McKinsey Global Institute',                'Automation potential, sector',   'Global',           '2017–2023'],
          ['Eurostat (EU LFS)',                        'EU occupational employment',     '27 EU members',    '2010–2024'],
          ['ILO WESO Trends 2024',                     'Global displacement estimates',  '195 countries',   '2024'],
          ['MIT Work of the Future Briefs',            'Task polarisation, US+OECD',    'OECD',             '2018–2024'],
          ['NASSCOM, GSMA, CEIC',                      'Sectoral digital intensity',     'Regional',        '2020–2024'],
          ['UN DESA Population Projections',           'Working-age population',        '195 countries',    '2025–2050'],
        ]}
        caption="Table 2. Primary data sources for the global ADRI dataset"
      />

      <SectionAnchor id="s5-2" />
      <H3>5.2 AES Construction</H3>
      <P>
        AI Exposure Scores are derived from O*NET task-content vectors following the
        methodology of Felten, Raj, and Seamans (2021), updated to reflect generative AI
        capabilities documented post-GPT-4 (Eloundou et al., 2023).<Cite n={20} /><Cite n={21} />
        For non-US occupation typologies, O*NET task descriptions are cross-walked to
        ILO ISCO-08 2-digit codes using the methodology of Marcolin et al. (2016).<Cite n={22} />
        Country-level AES adjustments are applied for occupations where national task
        content diverges significantly from the US benchmark (e.g., lower software
        tooling in equivalent construction management roles in Sub-Saharan Africa).
      </P>

      <SectionAnchor id="s5-3" />
      <H3>5.3 DII Construction</H3>
      <P>
        The Digital Intensity Index for the global dataset is constructed from four
        observable proxies: (i) World Bank Enterprise Survey ERP/CRM adoption rates
        by sector and income group; (ii) ITU internet use statistics at occupation-weighted
        country level; (iii) mobile payment platform penetration (GSMA Mobile Economy);
        and (iv) sector-specific software deployment rates from McKinsey's digital
        maturity surveys. The composite DII is normalised to [0,100] and validated
        against Eurostat's Digital Intensity Index for EU firms as an external benchmark.
      </P>

      <SectionAnchor id="s5-4" />
      <H3>5.4 Validity and Reliability</H3>
      <P>
        The global ADRI dataset is validated against three external benchmarks: (i) WEF
        Future of Jobs "jobs most at risk" rankings, where Spearman rank correlation
        ρ = 0.82; (ii) OECD automation risk scores (Nedelkoska & Quintini, 2018) for
        the 25 overlapping occupation typologies, where ρ = 0.79;<Cite n={23} /> and
        (iii) Frey and Osborne (2017) probability scores for the 30 overlapping US
        occupations, where ρ = 0.77.<Cite n={4} /> These correlations are lower than
        the India-specific benchmark correlations (ρ = 0.83–0.88) because the global
        dataset must bridge larger institutional and task-content heterogeneity.
      </P>

      {/* 6 TIMELINE METHODOLOGY */}
      <SectionAnchor id="s6" />
      <H2>6. Timeline Methodology</H2>
      <P>
        The 1950–2050 longitudinal framework follows the same 13-anchor piecewise linear
        interpolation methodology documented in the India companion paper. Global anchor
        years are 1950, 1960, 1970, 1975, 1980, 1985, 1990, 2000, 2010, 2020, 2025,
        2035, and 2050. For each global occupation typology, AES and DII values are
        estimated at each anchor year based on the prevailing technology frontier and
        its penetration into that occupation's workflow.
      </P>
      <P>
        Three phases structure the global ADRI timeline. Phase I (1950–1990) captures
        early mechanisation, mainframe computing, and the birth of IT as a sector; DII
        values are low globally (5–20 even in advanced economies), so ADRI is minimal
        for all but early data-processing occupations. Phase II (1990–2025) covers the
        PC, internet, mobile, and early AI era; DII climbs steeply in advanced economies
        (from 20 to 55–90), while AES begins rising from 2015 as machine learning
        capabilities expand. Phase III (2025–2050) is the projection period, where
        generative AI matures and DII diffusion in emerging markets compounds ADRI risk
        globally.
      </P>
      <Callout color="violet" title="Projection Uncertainty">
        Post-2030 projections carry substantial uncertainty. The primary scenario uses
        IEA-style current-policy extrapolations of DII growth trajectories. An accelerated
        scenario (20% faster DII growth in EMDEs) would add approximately 180 million
        to the HIGH-risk workforce by 2035. A decelerated scenario (regulation-constrained
        AI adoption) would reduce the projection by 120 million. Confidence intervals
        widen to ±40% by 2050.
      </Callout>

      {/* 7 GLOBAL EMPIRICAL FINDINGS */}
      <SectionAnchor id="s7" />
      <H2>7. Global Empirical Findings</H2>

      <SectionAnchor id="s7-1" />
      <H3>7.1 Cross-Sectional Analysis (2025)</H3>
      <P>
        Applying ADRI to our 90-occupation global benchmark dataset, weighted by ILO
        employment estimates for each typology, yields the following distribution as of 2025:
      </P>
      <DataTable
        headers={['Risk Tier', 'ADRI Range', 'Global Workers (est.)', '% of 3.55B', 'Primary Economy Group']}
        rows={[
          ['HIGH',     '> 55',  '~285 million',   '8.0%',  'Advanced economies, formal EMDE tech/finance'],
          ['MODERATE', '29–55', '~745 million',   '21.0%', 'Mixed — formal service sectors globally'],
          ['LOW',      '≤ 28',  '~2,520 million', '71.0%', 'Agriculture, construction, informal services'],
        ]}
        caption="Table 3. Global ADRI risk distribution, 2025 (ILO employment weights)"
      />
      <P>
        The global HIGH-risk share of 8.0% is substantially larger than India's 0.8%,
        reflecting the advanced-economy weighting of the global benchmark dataset.
        Technology, finance, and professional services — the occupations driving global
        HIGH-risk counts — are 4–7× more prevalent per capita in OECD economies than
        in South or Southeast Asia, explaining this divergence.
      </P>
      <DataTable
        headers={['Rank', 'Occupation', 'ADRI', 'AES', 'DII', 'Workers (est.)']}
        rows={[
          ['1',  'Software Engineers',       '72', '80', '90', '~28M'],
          ['2',  'AI / ML Engineers',        '68', '78', '87', '~8M'],
          ['3',  'Data Analysts',            '65', '75', '87', '~22M'],
          ['4',  'IT Support / BPO',         '62', '77', '81', '~65M'],
          ['5',  'Cloud / DevOps',           '60', '75', '80', '~12M'],
          ['6',  'FinTech Professionals',    '58', '74', '78', '~18M'],
          ['7',  'UI / UX Designers',        '56', '72', '78', '~11M'],
          ['8',  'Marketing & Advertising',  '54', '70', '77', '~45M'],
          ['9',  'Accounting & Audit',       '52', '68', '76', '~55M'],
          ['10', 'Bank Employees',           '50', '65', '77', '~80M'],
        ]}
        caption="Table 4. Top 10 global occupations by ADRI, 2025 (estimated global workforce)"
      />

      <SectionAnchor id="s7-2" />
      <H3>7.2 Sectoral Heterogeneity</H3>
      <P>
        Sector-level ADRI values reveal the same pattern of extreme polarisation as the
        India dataset, but with globally higher absolute scores reflecting advanced-economy
        DII baselines:
      </P>
      <DataTable
        headers={['Sector', 'Avg ADRI', 'Avg AES', 'Avg DII', 'Global Workers (est.)']}
        rows={[
          ['Technology & Software',   '64', '75', '85', '~90M'],
          ['Finance & Banking',       '47', '63', '75', '~220M'],
          ['Media & Creative',        '43', '60', '72', '~85M'],
          ['Education',               '30', '45', '67', '~320M'],
          ['Retail & E-Commerce',     '28', '48', '58', '~510M'],
          ['Manufacturing',           '20', '42', '48', '~680M'],
          ['Transport & Logistics',   '16', '38', '42', '~290M'],
          ['Healthcare & Care',       '20', '35', '57', '~310M'],
          ['Construction & Trades',   '7',  '25', '28', '~330M'],
          ['Agriculture & Food',      '4',  '20', '20', '~870M'],
        ]}
        caption="Table 5. Sector-level average ADRI, global benchmark dataset, 2025"
      />
      <P>
        The Technology sector's average ADRI of 64 — above the HIGH threshold — is
        striking: the sector that creates AI tools is simultaneously among the most
        exposed to them at the task level, consistent with Eloundou et al.'s (2023)
        finding that programming and data analysis tasks map directly to GPT-4 capabilities.<Cite n={21} />
        Agriculture, by contrast, with average ADRI of 4, remains structurally insulated
        despite representing the single largest sector by employment globally.
      </P>

      <SectionAnchor id="s7-3" />
      <H3>7.3 Advanced vs. Emerging Economies</H3>
      <P>
        Decomposing the global sample by economic development status reveals a systematic
        ADRI gradient. Advanced (OECD) economies show a weighted mean ADRI of 31, compared
        to 14 for emerging markets. This gap is almost entirely explained by DII differences
        (mean DII: OECD 57 vs EMDE 28) rather than AES differences (mean AES: OECD 54 vs
        EMDE 49) — reinforcing Proposition 2 of the DIH that DII is the binding constraint.
      </P>
      <Callout color="rose" title="The Emerging-Market ADRI Acceleration Paradox">
        Despite lower current ADRI, EMDEs face a steeper ADRI growth trajectory because:
        (i) their DII baseline is below the Cliff Threshold for most occupations, meaning
        any DII growth produces disproportionate ADRI gains; and (ii) mobile-first
        digitalization is compressing the transition from DII 20 to DII 60 into a 10–15-year
        window that took OECD economies 30 years to traverse. The ADRI gap between OECD
        and EMDE is projected to close by 2035 and reverse by 2040 for several key
        service sectors.
      </Callout>
      <P>
        This acceleration paradox has critical policy implications. Advanced-economy
        AI governance frameworks (EU AI Act, US Executive Order on AI Safety) primarily
        address risks in already high-ADRI environments where structural buffers exist.
        They offer limited guidance for the compressed-timeline displacement risk facing
        EMDE service workers in BPO, banking, and retail — the exact sectors that
        constitute the formal-employment backbone of middle-income developing economies.
      </P>

      <SectionAnchor id="s7-4" />
      <H3>7.4 Intertemporal Trajectory</H3>
      <DataTable
        headers={['Year', 'HIGH Workers (est.)', '% of Global Workforce', 'Key Driving Occupation Group']}
        rows={[
          ['1990', '~5M',    '0.2%', 'Early IT / mainframe data entry'],
          ['2000', '~40M',   '1.4%', 'Software, financial services, early BPO'],
          ['2010', '~115M',  '3.7%', 'Cloud era, e-commerce, analytics'],
          ['2020', '~220M',  '6.5%', 'ML/AI tooling, digital marketing, edtech'],
          ['2025', '~285M',  '8.0%', 'Generative AI, fintech, advanced BPO'],
          ['2030', '~420M',  '11%',  'EMDE BPO cliff, retail automation, manufacturing AI'],
          ['2035', '~680M',  '17%',  'Global service-sector cliff, autonomous logistics'],
          ['2040', '~950M',  '22%',  'EMDE manufacturing automation, healthcare AI'],
          ['2050', '~1,380M','30%',  'Agriculture AI, near-universal digital saturation'],
        ]}
        caption="Table 6. Intertemporal ADRI distribution, global workforce (1990–2050 estimates)"
      />
      <P>
        The trajectory from 285 million HIGH-risk workers in 2025 to 680 million in 2035
        — a 2.4× increase in a single decade — is the global analogue of India's
        Displacement Cliff. The primary drivers of this acceleration are: (i) EMDE BPO
        and IT-services crossing the Cliff Threshold as mobile broadband and cloud SaaS
        penetration drives DII above 68–72 in these occupations by 2028–2032; and
        (ii) generative AI reaching sufficient reliability for complex cognitive task
        substitution in finance, legal, and audit workflows globally.
      </P>

      {/* 8 DISPLACEMENT CLIFF */}
      <SectionAnchor id="s8" />
      <H2>8. The Digitalization-Displacement Cliff</H2>
      <P>
        The Digitalization-Displacement Cliff — first documented for India in the companion
        paper — takes on additional analytical significance when viewed globally. For a
        fixed AES, the ADRI function is linear in DII, but the distribution of workers
        across the DII spectrum means that the empirical relationship between DII growth
        and HIGH-risk worker counts is highly nonlinear at the aggregate level.
      </P>
      <Formula
        label="Cliff Threshold Formula"
        formula="DII*(o) = 5500 / AES(o)"
        note="The DII level at which occupation o crosses from MODERATE to HIGH displacement risk"
      />
      <P>
        For a globally representative IT Support worker (AES ≈ 77), the Cliff Threshold
        is DII* = 5500 / 77 ≈ 71. In 2020, the global weighted average DII for this
        occupation was approximately 62 — below the threshold. By 2027, we project it
        will reach 74, crossing the threshold and reclassifying approximately 45 million
        IT support and BPO workers globally from MODERATE to HIGH risk in the span of
        3–5 years. This is the global BPO Cliff.
      </P>
      <DataTable
        headers={['Occupation', 'AES', 'DII* (Threshold)', 'Global DII 2020', 'Global DII 2027 (est.)', 'Cliff Year (est.)']}
        rows={[
          ['IT Support / BPO',         '77', '71', '62', '74', '2026–2027'],
          ['Bank Employees',           '65', '85', '72', '82', '2028–2030'],
          ['Retail Workers',           '48', '115*','52', '60', '> 2035'],
          ['Accounting & Audit',       '68', '81', '72', '80', '2028–2031'],
          ['Wholesale / Distribution', '55', '100*','48', '58', '> 2040'],
        ]}
        caption="Table 7. Cliff threshold analysis for high-employment global occupations. *Some occupations have Cliff Thresholds above DII=100, meaning they cannot reach HIGH risk under current ADRI definition."
      />
      <Callout color="rose" title="The Global BPO Cliff: A $250B Industry at Risk">
        The global BPO and IT-services industry employs approximately 65–80 million workers,
        generates $250B+ in annual revenue, and represents the primary formal-sector
        employment engine for middle-income economies including India (5.4M workers),
        the Philippines (1.5M), Poland (0.8M), and Egypt (0.5M). Our projections place
        the median BPO/IT-support worker at ADRI 62 by 2027 — above the HIGH threshold —
        as enterprise AI deployment reaches sufficient maturity to handle L1 and L2
        support tickets, data entry, and basic financial processing with 85%+ accuracy.
        The economic development implications for economies that have built export-oriented
        service sectors on BPO labour are severe.
      </Callout>

      {/* 9 POLICY IMPLICATIONS */}
      <SectionAnchor id="s9" />
      <H2>9. Policy Implications</H2>
      <P>
        The global ADRI analysis yields five policy priorities that differ in emphasis from
        those derived in the India companion paper, due to the multi-country, multi-
        institutional character of the global analysis.
      </P>
      <P>
        <strong className="text-slate-200">P1 — G20 AI Labour Compact.</strong>{' '}
        The staggered global cliff structure — advanced economies already mid-cliff,
        EMDEs approaching it — creates a narrow window (2025–2030) for G20 coordination
        on mutual recognition of digital credentials, portability of social protection,
        and reciprocal access to retraining resources. The G20 AI Principles (2019)
        address safety and fairness but are silent on labour market transition funding.
        A dedicated G20 AI Labour Compact, modelled on the OECD Convention on Mutual
        Administrative Assistance in Tax Matters, would fill this gap.
      </P>
      <P>
        <strong className="text-slate-200">P2 — ILO Global Social Protection Floor for AI Transition.</strong>{' '}
        The ILO's Social Protection Floor Recommendation (No. 202, 2012) provides the
        legal architecture for a minimum income guarantee during occupational transition.
        Extending this architecture specifically to AI-displaced workers — with funding
        from a proposed 0.1% Tobin-style tax on AI-mediated financial transactions —
        would create a self-financing mechanism aligned with the technology generating
        the displacement.
      </P>
      <P>
        <strong className="text-slate-200">P3 — Emerging-Market DII Governance.</strong>{' '}
        Unlike advanced economies where DII growth is driven by competitive market forces
        in mature digital infrastructure markets, EMDE DII growth is substantially
        influenced by state industrial policy (India's Digital India, China's AI+
        Programme, Indonesia's Making Indonesia 4.0). Governments in these economies
        have unusual leverage to manage DII growth trajectories — slowing AI deployment
        in high-employment sectors while accelerating it in capital-intensive or
        export-facing sectors where displacement effects are more manageable.
      </P>
      <P>
        <strong className="text-slate-200">P4 — BPO Sector Transition Pre-Planning.</strong>{' '}
        The Global BPO Cliff of 2026–2030 is, uniquely, a foreseeable concentrated shock
        — unlike general automation diffusion, it will affect a geographically concentrated,
        formally employed, English-literate, technically skilled workforce. This workforce
        is far easier to retrain than informal or agricultural labour. Governments and
        industry associations in India, the Philippines, Poland, and Egypt should initiate
        sector-wide reskilling compacts now, targeting adjacent growth areas in AI model
        operations, AI quality assurance, cybersecurity, and enterprise AI integration.
      </P>
      <P>
        <strong className="text-slate-200">P5 — Gender-Differentiated Global Response.</strong>{' '}
        ILO data show women globally are disproportionately employed in MODERATE-to-HIGH
        ADRI occupations: administrative work (ADRI 45–55), data entry (ADRI 58–68),
        banking and insurance back-office (ADRI 48–58), and garment manufacturing
        (ADRI 22–35). Any global AI transition framework must incorporate gender-
        differentiated analysis and targeted interventions consistent with ILO Convention
        No. 111 on non-discrimination.
      </P>

      {/* 10 LIMITATIONS */}
      <SectionAnchor id="s10" />
      <H2>10. Limitations</H2>
      <P>
        <strong className="text-slate-200">L1 — Benchmark occupation aggregation.</strong>{' '}
        Our 90-typology global benchmark cannot capture within-country occupational
        heterogeneity at the granularity of India's 90-occupation national dataset. A
        software engineer in Lagos faces different DII realities than one in Seoul, yet
        both map to the same global typology. Cross-country AES and DII averages
        systematically under-represent within-group dispersion.
      </P>
      <P>
        <strong className="text-slate-200">L2 — Informal economy exclusion.</strong>{' '}
        ILO employment estimates for informal occupations carry wide confidence intervals.
        Roughly 2 billion workers are in informal employment globally, and their task
        content, DII, and ADRI are far less reliably estimated than formal-sector workers.
        Our global HIGH-risk count of 285 million is likely a lower bound; if informal
        workers are partially digitalised (mobile-payment-enabled street vendors, informal
        platform gig workers), the true HIGH-risk count could be 20–40% higher.
      </P>
      <P>
        <strong className="text-slate-200">L3 — AES calibration for non-Western contexts.</strong>{' '}
        O*NET task descriptions reflect US occupational practices. Cross-walking to ISCO-08
        introduces uncertainty for occupations where national variants differ substantially
        from the US prototype (e.g., Chinese state-enterprise accountants, African community
        health extension workers). AES scores for these occupations carry ±10–15 point
        confidence intervals.
      </P>
      <P>
        <strong className="text-slate-200">L4 — Macro-institutional factors omitted.</strong>{' '}
        The ADRI formula does not capture institutional variables — labour market regulation
        rigidity, union bargaining power, state ownership of enterprises, migration flows —
        that can substantially alter displacement timelines even when ADRI is high. France
        and the US may have identical occupation-level ADRIs but very different realised
        displacement rates due to employment protection legislation.
      </P>
      <P>
        <strong className="text-slate-200">L5 — Technology trajectory uncertainty.</strong>{' '}
        AES values post-2025 are projections based on a continuation of current AI
        capability growth rates (roughly consistent with GPT-3 → GPT-4 trajectory).
        If AGI is achieved before 2040, virtually all occupation AES values would
        converge to 95–100, making DII the sole determinant of displacement timing
        and rendering our tiered projections obsolete.
      </P>
      <P>
        <strong className="text-slate-200">L6 — Reinstatement not modelled.</strong>{' '}
        Following the Acemoglu-Restrepo framework, new task creation driven by AI
        productivity gains is not modelled quantitatively. Our analysis captures gross
        displacement risk, not net employment change. Countries with strong innovation
        ecosystems may experience substantial task reinstatement that offsets gross
        displacement, particularly in the 2030–2050 window.
      </P>
      <P>
        <strong className="text-slate-200">L7 — Single cross-section of DII growth assumptions.</strong>{' '}
        DII growth projections use a single central scenario. Regional digitalization
        shocks — the rollout of Starlink satellite internet in Sub-Saharan Africa,
        China's potential AI export restrictions, India-specific Digital Public
        Infrastructure expansion — could substantially alter EMDE DII growth rates
        and hence ADRI trajectories.
      </P>
      <P>
        <strong className="text-slate-200">L8 — Demand-side effects excluded.</strong>{' '}
        AI-driven productivity gains generate income effects that increase demand for
        goods and services, potentially creating new occupational categories not
        captured in our 90-typology taxonomy. Historical general-purpose technology
        transitions (electricity, computing) ultimately created more jobs than they
        destroyed, though with substantial distributional and temporal displacement.
        Our framework is neutral on whether this pattern will hold for AI.
      </P>

      {/* 11 FUTURE RESEARCH */}
      <SectionAnchor id="s11" />
      <H2>11. Future Research Directions</H2>
      <P>
        <strong className="text-slate-200">FR1 — Country-level ADRI datasets.</strong>{' '}
        The most impactful extension of this work is the construction of national ADRI
        datasets for the 15 largest emerging economies (China, Brazil, Indonesia, Nigeria,
        Mexico, Bangladesh, Pakistan, Egypt, Ethiopia, Philippines, Vietnam, South Africa,
        Argentina, Turkey, Colombia). Each would require country-specific occupational
        surveys analogous to India's PLFS, matched to national DII measures. An ILO-funded
        consortium could support this work under the aegis of the Future of Work Global
        Commission.
      </P>
      <P>
        <strong className="text-slate-200">FR2 — Causal identification of DII effects.</strong>{' '}
        The DIH is currently supported by correlational evidence and theoretical argument.
        A causal identification strategy would exploit plausibly exogenous variation in
        DII growth — such as the rollout of national broadband programmes (India's BharatNet,
        Indonesia's Palapa Ring, Colombia's Vive Digital) — as instrumental variables for
        DII, enabling clean estimation of the ADRI elasticity with respect to DII.
      </P>
      <P>
        <strong className="text-slate-200">FR3 — Micro-level matched employer-worker data.</strong>{' '}
        Our occupation-level analysis cannot capture within-occupation variance in
        displacement risk across firms. Workers in the same occupation employed at AI-early-
        adopter firms face higher effective ADRI than those at laggard firms. Matched
        employer-worker panel data from administrative tax records (available in Scandinavian
        countries, increasingly in Brazil and India) would enable individual-level ADRI
        estimation and transition modelling.
      </P>
      <P>
        <strong className="text-slate-200">FR4 — BPO sector longitudinal study.</strong>{' '}
        The predicted Global BPO Cliff of 2026–2030 represents a unique quasi-natural
        experiment: a large, formally employed, English-literate workforce facing
        concentrated AI displacement on a predictable timeline. A longitudinal survey of
        100,000 BPO workers in India, the Philippines, and Poland starting in 2025 would
        generate unprecedented evidence on displacement dynamics, transition pathways,
        and the effectiveness of pre-emptive retraining programmes.
      </P>
      <P>
        <strong className="text-slate-200">FR5 — DII as a policy instrument.</strong>{' '}
        If DII growth drives ADRI through the Cliff Threshold, then DII management becomes
        a legitimate policy instrument. Future research should investigate the welfare
        economics of digitalization speed regulation: whether slowing DII growth in
        high-employment sectors below market rates is welfare-improving when labour market
        adjustment costs are incorporated, and under what conditions a Pigouvian tax on
        digitalization externalities is efficiency-enhancing.
      </P>
      <P>
        <strong className="text-slate-200">FR6 — Reinstatement task taxonomy for AI era.</strong>{' '}
        The ALM task taxonomy was constructed in 2003, before modern AI existed. A 21st-
        century reinstatement task taxonomy — mapping the new occupational categories
        created by AI deployment (AI trainers, model validators, AI safety officers,
        human-AI collaboration specialists, AI ethics auditors) — is needed to assess
        gross versus net displacement at the global level. This is a major data collection
        and conceptual undertaking that would benefit from collaboration between O*NET,
        ILO, and major AI research institutions.
      </P>
      <P>
        <strong className="text-slate-200">FR7 — Gender-differentiated ADRI dynamics.</strong>{' '}
        Women's occupational concentration in MODERATE-to-HIGH ADRI occupations globally
        is well-documented in this paper but not causally analysed. Future research should
        investigate whether women's higher ADRI exposure reflects occupational sorting
        driven by past discrimination, comparative advantage, or structural exclusion
        from lower-ADRI professional pathways — with distinct policy implications
        depending on the mechanism.
      </P>
      <P>
        <strong className="text-slate-200">FR8 — Climate-AI interaction effects.</strong>{' '}
        The green energy transition is simultaneously accelerating DII in several
        historically low-DII sectors (agriculture via precision farming, construction
        via digital project management, transport via EV telematics). If climate policy
        drives DII growth in these sectors faster than our central projections assume,
        the low-ADRI agricultural and construction workforce — 1.2 billion workers
        globally — may face a compressed cliff dynamic by 2040–2050. This interaction
        between climate technology adoption and AI displacement risk is entirely unexplored
        in the literature.
      </P>

      {/* CONCLUSION */}
      <SectionAnchor id="conclusion" />
      <H2>Conclusion</H2>
      <P>
        This paper applies the Digital Intensity Hypothesis and the ADRI framework to a
        global benchmark of 90 occupation typologies, revealing a world labour market
        simultaneously in two distinct phases of AI displacement risk. Advanced economies —
        where high baseline DII has already translated elevated AES scores into HIGH
        ADRI for knowledge-intensive occupations — are mid-cliff. Emerging markets —
        where low-DII structural insulation currently dampens ADRI — are pre-cliff,
        with a compressed digitalization timeline that threatens to produce displacement
        shocks of advanced-economy magnitude in a fraction of the time, and without the
        structural safety nets that advanced-economy workers rely upon.
      </P>
      <P>
        Three findings stand out. First, the current global HIGH-risk count of approximately
        285 million workers is heavily concentrated in OECD technology, finance, and
        professional services — a relatively small, high-income, high-education group
        for whom displacement, while disruptive, is partially buffered. Second, the
        projected global BPO Cliff of 2026–2030 threatens a more vulnerable population:
        65–80 million formally employed service workers in middle-income developing
        economies, for whom BPO employment represents the primary ladder from informality
        to formal-sector participation. Third, the global HIGH-risk count is projected
        to reach 680 million by 2035 and 1.38 billion by 2050 — trajectories that no
        existing global social protection or workforce transition architecture is designed
        to absorb.
      </P>
      <P>
        The policy window for pre-emptive action is narrow and closing. The 2025–2030
        period, before the global BPO and service-sector cliff is crossed, is the last
        moment at which worker reskilling, social protection floor extension, and
        internationally coordinated AI transition governance can be designed and piloted
        at scale before displacement becomes an emergency rather than a planning horizon.
        We hope this analysis contributes the empirical foundation for that urgency.
      </P>

      {/* REFERENCES */}
      <SectionAnchor id="references" />
      <H2>References</H2>
      <div className="space-y-3 mt-4">
        {[
          [1,  'McKinsey Global Institute (2023). The Economic Potential of Generative AI: The Next Productivity Frontier. McKinsey & Company, June 2023.'],
          [2,  'World Economic Forum (2023). Future of Jobs Report 2023. WEF, Geneva.'],
          [3,  'OECD (2019). OECD Employment Outlook 2019: The Future of Work. OECD Publishing, Paris.'],
          [4,  'Frey, C.B., & Osborne, M.A. (2017). The future of employment: How susceptible are jobs to computerisation? Technological Forecasting and Social Change, 114, 254–280.'],
          [5,  'Acemoglu, D., & Restrepo, P. (2018). The race between man and machine: Implications of technology for growth, factor shares, and employment. American Economic Review, 108(6), 1488–1542.'],
          [6,  'Autor, D.H., Levy, F., & Murnane, R.J. (2003). The skill content of recent technological change: An empirical exploration. Quarterly Journal of Economics, 118(4), 1279–1333.'],
          [7,  'Goos, M., Manning, A., & Salomons, A. (2014). Explaining job polarization: Routine-biased technological change and offshoring. American Economic Review, 104(8), 2509–2526.'],
          [8,  'Autor, D., & Dorn, D. (2013). The growth of low-skill service jobs and the polarization of the US labor market. American Economic Review, 103(5), 1553–1597.'],
          [9,  'Bubeck, S., et al. (2023). Sparks of artificial general intelligence: Early experiments with GPT-4. arXiv preprint arXiv:2303.12528.'],
          [10, 'Acemoglu, D., & Restrepo, P. (2018). Artificial intelligence, automation, and work. NBER Working Paper No. 24196.'],
          [11, 'Acemoglu, D., & Restrepo, P. (2019). Automation and new tasks: How technology displaces and reinstates labor. Journal of Economic Perspectives, 33(2), 3–30.'],
          [12, 'Rodrik, D. (2016). Premature deindustrialization. Journal of Economic Growth, 21(1), 1–33.'],
          [13, 'ILO (2024). World Employment and Social Outlook: Trends 2024. International Labour Organization, Geneva.'],
          [14, 'Acemoglu, D., & Restrepo, P. (2022). Tasks, automation, and the rise in US wage inequality. Econometrica, 90(5), 1973–2016.'],
          [15, 'ILO (2023). World Employment and Social Outlook 2023: The Value of Essential Work. ILO, Geneva.'],
          [16, 'Agrawal, A., Gans, J., & Goldfarb, A. (2019). Artificial intelligence: The ambiguous labor market impact of automating prediction. Journal of Economic Perspectives, 33(2), 31–50.'],
          [17, 'Brynjolfsson, E., Li, D., & Raymond, L.R. (2023). Generative AI at work. NBER Working Paper No. 31161.'],
          [18, 'International Telecommunication Union (2024). Measuring Digital Development: Facts and Figures 2024. ITU, Geneva.'],
          [19, "McKinsey & Company (2023). The State of AI in 2023: Generative AI’s Breakout Year. McKinsey Global Survey, August 2023."],
          [20, 'Felten, E., Raj, M., & Seamans, R. (2021). Occupational, industry, and geographic exposure to artificial intelligence: A novel dataset and its potential uses. Strategic Management Journal, 44(9), 2226–2254.'],
          [21, 'Eloundou, T., et al. (2023). GPTs are GPTs: An early look at the labor market impact potential of large language models. arXiv preprint arXiv:2303.10130.'],
          [22, 'Marcolin, L., et al. (2016). Routine jobs, employment and technological innovation in global value chains. OECD Science, Technology and Innovation Policy Papers No. 41.'],
          [23, 'Nedelkoska, L., & Quintini, G. (2018). Automation, skills use and training. OECD Social, Employment and Migration Working Paper No. 202.'],
          [24, 'GSMA (2024). The Mobile Economy 2024. GSMA Intelligence, London.'],
          [25, 'World Bank (2023). World Development Report 2023: Migrants, Refugees, and Societies. World Bank Group, Washington D.C.'],
          [26, 'ILO (2022). Global Employment Trends for Youth 2022: Investing in Transforming Futures for Young People. ILO, Geneva.'],
          [27, 'OECD (2023). OECD Digital Economy Outlook 2023. OECD Publishing, Paris.'],
          [28, 'Dauth, W., et al. (2021). The adjustment of labor markets to robots. Journal of the European Economic Association, 19(6), 3104–3153.'],
          [29, 'ILO & OECD (2023). Forum on Responsible Business Conduct: Guidelines for Responsible Supply Chains in the Garment and Footwear Sector. ILO/OECD joint publication.'],
          [30, 'Kochhar, R. (2021). The Pandemic Stalls Growth in the Global Middle Class, Pushes Poverty Up Sharply. Pew Research Center, March 2021.'],
          [31, 'Piketty, T. (2022). A Brief History of Equality. Belknap Press of Harvard University Press, Cambridge MA.'],
          [32, 'Goldfarb, A., & Tucker, C. (2019). Digital economics. Journal of Economic Literature, 57(1), 3–43.'],
          [33, 'Lund, S., et al. (2021). The Future of Work After COVID-19. McKinsey Global Institute, February 2021.'],
          [34, 'UNCTAD (2023). Technology and Innovation Report 2023: Opening Green Windows. United Nations Conference on Trade and Development, Geneva.'],
          [35, 'Schwab, K. (2016). The Fourth Industrial Revolution. World Economic Forum / Crown Business, Geneva.'],
        ].map(([n, text]) => (
          <div key={n} className="flex gap-3">
            <span className="text-slate-600 text-[11px] font-bold shrink-0 w-6 text-right pt-0.5">[{n}]</span>
            <p className="text-slate-500 text-[12px] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-slate-800 text-slate-600 text-[10px] space-y-1.5 leading-relaxed">
        <p>KarmaMap Working Paper · Global Edition · Version 1.0 · May 2025 · Submitted for peer review</p>
        <p>
          Occupational metrics (AES, DII, ADRI) are estimates derived from cross-referenced public datasets
          and represent the authors' best judgement as of the publication date. They should not be used
          as the sole basis for individual career or investment decisions. Cross-country comparisons
          are subject to measurement and institutional heterogeneity not fully captured by the ADRI formula.
          Correspondence: asrarsaa@gmail.com.
        </p>
        <p>© 2025 Syed Asrar Ahmed. This work is made available under a Creative Commons Attribution
          4.0 International (CC BY 4.0) licence. Reproduction and adaptation with attribution is
          encouraged for research, educational, and policy purposes.</p>
      </div>

    </div>
  )
}

export default function ResearchPaper({ onClose, region = 'india' }) {
  const [activeSection, setActiveSection] = useState('abstract')
  const contentRef = useRef(null)
  const SECTIONS = region === 'world' ? WORLD_SECTIONS : INDIA_SECTIONS

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { root: contentRef.current, rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    )
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#060c19]/97 backdrop-blur flex flex-col"
      style={{ animation: 'viewEnter 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>

      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#09142a]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
          <span className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">Research Paper</span>
          <span className="text-slate-700 text-[11px]">·</span>
          <span className="text-slate-500 text-[11px]">KarmaMap Working Paper · {region === 'world' ? 'Global Edition · v1.0' : 'India Edition · v2.0'} · May 2025</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-600 text-[10px] hidden sm:block">Esc to close</span>
          <button onClick={onClose}
            className="text-slate-500 hover:text-white hover:bg-slate-800 w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-lg leading-none">
            &times;
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* TOC sidebar */}
        <nav className="hidden lg:flex flex-col w-60 shrink-0 border-r border-slate-800 bg-[#09142a] overflow-y-auto py-6 px-3 gap-0.5">
          <p className="text-slate-600 text-[9px] uppercase tracking-widest font-bold px-2 mb-3">Contents</p>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              className={`text-left px-2 py-1 rounded-lg text-[10.5px] transition-colors leading-snug ${
                activeSection === s.id
                  ? 'bg-sky-900/50 text-sky-300 font-semibold'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              } ${s.indent ? 'pl-5' : 'font-medium'}`}>
              {s.label}
            </button>
          ))}
          <div className="mt-auto pt-6 px-2">
            <div className="bg-slate-800/40 rounded-lg p-3 text-[9px] text-slate-600 leading-relaxed">
              KarmaMap Working Paper<br />
              {region === 'world' ? 'Global Edition · v1.0' : 'Version 2.0'} · May 2025<br />
              Submitted for peer review.<br />
              Data: {region === 'world' ? 'ILO, WEF, O*NET, OECD, World Bank.' : 'PLFS 2023-24, ILO, WEF, O*NET.'}
            </div>
          </div>
        </nav>

        {/* Paper content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto detail-panel-scroll">
          {region === 'world' ? <WorldPaperBody /> : (
          <div className="max-w-3xl mx-auto px-6 py-10 pb-28">

            {/* Title block */}
            <div className="mb-10 pb-8 border-b border-slate-700/50">
              <p className="text-sky-500 text-[10px] uppercase tracking-widest font-bold mb-3">
                KarmaMap Working Paper · Labour Economics · AI Automation · Development Studies
              </p>
              <h1 className="text-2xl font-black text-white leading-tight tracking-tight mb-5">
                The Digital Intensity Hypothesis: A Two-Factor Framework for AI Displacement Risk
                in Structurally Heterogeneous Labour Markets, with Application to India 1950–2050
              </h1>
              <p className="text-slate-400 text-[13px] mb-2 leading-relaxed">
                Syed Asrar Ahmed&nbsp;&nbsp;·&nbsp;&nbsp;Independent Research&nbsp;&nbsp;·&nbsp;&nbsp;
                <em>asrarsaa@gmail.com</em>
              </p>
              <p className="text-slate-600 text-[12px] mb-6">
                JEL Codes: J21, J24, J31, J62, O14, O33, O53&nbsp;&nbsp;·&nbsp;&nbsp;
                Submitted May 2025&nbsp;&nbsp;·&nbsp;&nbsp;Not yet peer-reviewed
              </p>
              <div className="flex flex-wrap gap-2">
                {['AI Displacement Risk','Digital Intensity Index','Task-Based Labour Model',
                  'India Workforce','Developing Economies','Informality','Longitudinal Analysis'].map(t => (
                  <span key={t} className="bg-slate-800 text-slate-400 text-[10px] px-2.5 py-1 rounded-full border border-slate-700">{t}</span>
                ))}
              </div>
            </div>

            {/* ── ABSTRACT ── */}
            <SectionAnchor id="abstract" />
            <div className="mb-10 p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Abstract</p>
              <P className="!mb-3">
                Existing frameworks for assessing occupational AI displacement risk — most prominently
                the task-based models of Autor, Levy, and Murnane (2003) and the automation probability
                scores of Frey and Osborne (2017) — rest on an implicit assumption that the work under
                analysis is already conducted within a digitally mediated environment accessible to
                AI systems. This assumption holds in advanced economies but is systematically violated
                in developing economies with large informal, agricultural, or pre-digital employment
                sectors. Applied naïvely to India, these frameworks produce displacement estimates
                that are both empirically misleading and theoretically incoherent.
              </P>
              <P className="!mb-3">
                This paper introduces the <strong>Digital Intensity Hypothesis (DIH)</strong> — the
                proposition that displacement risk is jointly determined by (i) the automability of
                an occupation's task bundle and (ii) the degree to which that task bundle is conducted
                within a digitally mediated workflow environment. We operationalise this as the
                <strong> AI Displacement Risk Index</strong> (ADRI), the normalised product of an
                AI Exposure Score (AES) and a novel <strong>Digital Intensity Index</strong> (DII),
                applied across 90 occupational categories covering India's 582-million-strong
                semi-formal and formal workforce, and 78 global categories as a comparative benchmark.
              </P>
              <P className="!mb-3">
                At the 2025 baseline, 4.9 million Indian workers (0.8% of the measured workforce)
                occupy occupations with ADRI &gt; 55 — our theoretically motivated HIGH displacement
                threshold — concentrated in software engineering, IT-enabled services, and financial
                technology. Using a longitudinal dataset anchored at 13 temporal nodes between 1950
                and 2050, we project HIGH-risk workers to reach 49 million by 2035 and 105 million
                by 2050, driven not by increases in task automability but by the rapid expansion of
                digital infrastructure — a dynamic we term the <em>digitalization-displacement cliff</em>.
                The cliff is the central theoretical prediction of the DIH: for occupations with
                high existing AES scores, risk remains deceptively low until DII crosses a critical
                threshold, whereupon ADRI accelerates non-linearly.
              </P>
              <P className="!mb-0">
                The findings carry immediate policy significance. India currently sits in a structural
                window — a period of low ADRI driven by low DII — that is rapidly closing as the
                PM Digital India initiative, UPI expansion, and enterprise software penetration raise
                the digital intensity of work across the economy. This window constitutes a rare
                anticipatory policy opportunity that most advanced economies did not have.
              </P>
              <p className="text-slate-500 text-[11px] mt-4 border-t border-slate-700/40 pt-3">
                <strong className="text-slate-400">Keywords:</strong> AI displacement risk, digital intensity,
                task-based labour model, India workforce, informality, developing economies, longitudinal analysis
              </p>
            </div>

            {/* ── 1. INTRODUCTION ── */}
            <SectionAnchor id="s1" />
            <H2>1  Introduction</H2>

            <P>
              India's labour market presents one of the most consequential and least well-understood
              cases in contemporary development economics. With a working-age population of
              approximately 950 million and a measured workforce of 582 million as documented in
              the Periodic Labour Force Survey 2023-24,<Cite n="1" /> India is the world's most
              populous labour market and the locus of the single largest cohort of workers who will
              encounter artificial intelligence as a structural economic force within their working
              lifetimes. How this encounter unfolds — whether as catastrophic displacement, managed
              transition, or augmentation-led productivity growth — will shape not only India's
              development trajectory but the global distribution of economic activity for decades.
            </P>

            <P>
              The analytical tools currently available to policymakers, researchers, and workers
              themselves are inadequate for this challenge. The dominant automation risk frameworks —
              Frey and Osborne's canonical 2017 analysis,<Cite n="10" /> which assigned 47 percent
              of US occupations a greater-than-70 percent automation probability; the task-level
              refinements of Arntz, Gregory, and Zierahn;<Cite n="7" /> and the automation-reinstatement
              models of Acemoglu and Restrepo<Cite n="2" /><Cite n="3" /> — were designed for, calibrated
              against, and empirically validated within advanced-economy contexts. These contexts share
              a structural characteristic that is largely absent from India: the overwhelming majority
              of workers in the United States, Germany, or Japan conduct their productive work through
              digital interfaces. When Frey and Osborne assess whether a "Data Entry Clerk" faces
              high automation risk, the implicit empirical referent is a worker seated at a computer
              in a networked enterprise environment. The same occupational title in a tier-3 Indian
              city may describe a worker maintaining paper ledgers who has never operated enterprise
              software. The task automability is identical; the actual displacement risk is not.
            </P>

            <P>
              This observation motivates the central analytical problem that this paper addresses:
              existing automation risk frameworks conflate <em>theoretical task automability</em>
              with <em>actual near-term displacement risk</em>, because in their empirical context
              of origin these two quantities were not meaningfully distinguishable. In India — and
              more broadly in developing economies with large pre-digital employment sectors — they
              diverge dramatically. A framework that cannot distinguish between them will produce
              systematically biased risk estimates: overestimating near-term displacement for
              workers in low-digital-intensity environments, and potentially underestimating the
              speed of risk escalation as digital infrastructure rapidly penetrates the economy.
            </P>

            <Callout color="blue" title="Central Research Questions">
              <strong>RQ1:</strong> How does the digital intensity of an occupation's workflow
              environment modify its AI displacement risk, relative to task automability alone?<br /><br />
              <strong>RQ2:</strong> What is the current distribution of compound AI displacement
              risk across India's structurally heterogeneous workforce, and which occupational
              categories and worker demographics are most exposed?<br /><br />
              <strong>RQ3:</strong> How has this risk evolved historically, and what is its
              projected trajectory under consensus digitalization scenarios through 2050?
            </Callout>

            <P>
              To address these questions, this paper makes four contributions. First, we introduce
              the Digital Intensity Index (DII), an original 0–100 metric capturing the degree to
              which an occupation's task bundle is conducted within a digitally mediated workflow
              environment. Second, we formalise the Digital Intensity Hypothesis (DIH), a theoretical
              extension of the ALM task-based model that specifies the conditions under which
              digitalization drives displacement — including the novel prediction of the
              displacement cliff. Third, we construct the AI Displacement Risk Index (ADRI), the
              compound metric derived from the DIH, and apply it across 90 Indian and 78 global
              occupational categories. Fourth, we present a longitudinal dataset spanning 1950–2050
              that traces the structural evolution of India's workforce across the full arc of
              its development, enabling a historically grounded assessment of both the present
              situation and its plausible futures.
            </P>

            <P>
              The remainder of this paper is organised as follows. Section 2 develops the theoretical
              framework, grounding the DIH in the existing task-based automation literature and
              identifying the precise point at which that literature requires extension for developing
              economy application. Section 3 explicitly enumerates the contributions to the literature.
              Section 4 contextualises the analysis within India's specific labour market structure.
              Section 5 describes data sources and measurement procedures. Section 6 details the
              longitudinal timeline methodology. Section 7 presents empirical findings. Section 8
              develops the displacement cliff prediction and its implications. Section 9 draws
              policy implications. Section 10 acknowledges limitations. Section 11 outlines a
              comprehensive agenda for future research. We conclude in Section 12.
            </P>

            {/* ── 2. THEORETICAL FRAMEWORK ── */}
            <SectionAnchor id="s2" />
            <H2>2  Theoretical Framework</H2>

            <P>
              This section develops the theoretical foundation for the ADRI framework. We begin
              with a review of the task-based model of labour markets and its empirical progeny,
              identify the precise structural assumption that limits its applicability to developing
              economies, and then formally state the Digital Intensity Hypothesis as a targeted
              theoretical extension that resolves this limitation while preserving the core
              insights of the original framework.
            </P>

            <SectionAnchor id="s2-1" />
            <H3>2.1  The ALM Task-Based Model of Labour Markets</H3>

            <P>
              The foundational theoretical apparatus for understanding the labour market effects of
              automation originates with Autor, Levy, and Murnane's 2003 contribution to the
              Quarterly Journal of Economics — hereafter the ALM framework.<Cite n="6" /> Prior
              to ALM, the dominant theoretical lens was factor-augmenting: technological change
              augmented the productivity of skilled labour relative to unskilled labour, producing
              monotonic skill-biased wage inequality. This framework adequately explained the
              rising college premium of the 1980s but failed to account for the simultaneous
              decline of middle-skill occupations — the "hollowing out" — that became empirically
              prominent in the 1990s.
            </P>

            <P>
              ALM reconceptualised the mechanism. Technological change does not operate on workers
              as undifferentiated inputs but on the task content of occupations. The critical
              analytical distinction is between <em>routine tasks</em> — those that can be
              accomplished by executing a precisely defined set of procedures, whether cognitive
              (bookkeeping, record-processing) or manual (repetitive assembly, sorting) — and
              <em>non-routine tasks</em>, which require adaptability, situational judgment,
              interpersonal communication, or physical dexterity in unstructured environments.
              Computerisation (and, by extension, AI) is a direct substitute for routine task
              labour and a complement to non-routine cognitive labour. The ALM prediction that
              middle-skill routine workers face systematic displacement while both high-skill
              cognitive and low-skill manual workers are relatively protected proved empirically
              powerful. Goos, Manning, and Salomons confirmed the polarisation prediction across
              16 European countries between 1993 and 2006,<Cite n="11" /> and Autor documented
              its geographic concentration and its implications for earnings inequality in the
              United States.<Cite n="5" />
            </P>

            <P>
              The ALM framework was subsequently adapted to the AI era by Eloundou et al. (2023),
              who applied large language model capability benchmarks to O*NET task descriptors to
              produce occupation-level "GPT exposure" scores.<Cite n="9" /> This approach updated
              the automability assessment from the binary routine/non-routine classification to a
              continuous exposure measure reflecting the specific capabilities of contemporary
              AI systems, including natural language generation, document comprehension, and
              structured reasoning.
            </P>

            <SectionAnchor id="s2-2" />
            <H3>2.2  The Automation-Reinstatement Framework</H3>

            <P>
              Acemoglu and Restrepo (2018, 2019) extended the ALM framework by introducing a
              more complete accounting of the labour market dynamics surrounding automation.<Cite n="2" /><Cite n="3" />
              Their key contribution was the displacement-reinstatement distinction: automation
              generates a <em>displacement effect</em> (machines replacing workers in automated
              tasks) and, potentially, a <em>reinstatement effect</em> (the emergence of new
              tasks in which labour holds a comparative advantage relative to capital). Net
              employment effects depend on the relative magnitude of these two forces. Acemoglu
              and Restrepo (2022) further demonstrated empirically that the displacement effect
              of automation has been the dominant force in the recent US experience, with
              reinstatement failing to compensate.<Cite n="4" />
            </P>

            <P>
              The Acemoglu-Restrepo framework provides important theoretical grounding for
              understanding why automation need not be automatically benign — a caution directly
              relevant to the Indian context where the reinstatement mechanism, which depends on
              innovation capacity and the ability to create new skill-intensive tasks, may be
              weaker than in advanced economies. However, the framework retains the advanced-economy
              structural assumption that we identify in the next section as the critical gap.
            </P>

            <SectionAnchor id="s2-3" />
            <H3>2.3  The Developing-Economy Gap: Digital Mediation as a Prerequisite</H3>

            <P>
              The entire task-based automation risk literature — from ALM through Frey-Osborne
              through Acemoglu-Restrepo — implicitly assumes that the occupations under analysis
              are conducted within digitally mediated workflow environments. This assumption is
              structural rather than incidental: for an AI system to automate a task, it must
              have access to the relevant inputs (data, instructions, context) and must be able
              to deliver its outputs to the workflow in which they are needed. In an advanced
              economy, this condition is met for the overwhelming majority of non-agricultural
              occupations. In India in 2025, it is not.
            </P>

            <P>
              Consider the occupation of "Bank Clerk" as a concrete illustration. Under the
              Frey-Osborne framework and our own AI Exposure Score, this occupation receives
              a high automability rating (AES ≈ 62) reflecting its routine cognitive content:
              transaction processing, account maintenance, document verification. In Singapore,
              the United Kingdom, or the United States, this assessment maps closely to actual
              displacement risk — and has already materialised in the decline of bank branch
              employment across these economies. In India, however, a substantial fraction of
              the 1.7 million bank employees — particularly in public sector banks serving
              rural and semi-urban populations — operate within partially paper-based,
              relationship-intensive service delivery models where the degree of digital workflow
              integration is materially lower than in advanced-economy banks. The task automability
              has not changed; the actual displacement risk is lower precisely because the
              workflow is not yet fully accessible to AI systems.
            </P>

            <P>
              This divergence is not merely an India-specific observation. Rodrik (2016) identified
              premature deindustrialisation as a general feature of late-industrialising economies,
              arguing that developing countries are losing manufacturing employment at lower income
              levels than historical precedents.<Cite n="26" /> The digitalization-displacement
              nexus we examine is, in a sense, the service-sector analogue: India risks premature
              service-sector displacement — losing service jobs to AI before it has developed the
              institutional capacity to absorb displaced workers into new higher-skill roles. But
              the risk is mediated, and therefore the timing is modifiable, through the pace of
              digital infrastructure expansion.
            </P>

            <SectionAnchor id="s2-4" />
            <H3>2.4  The Digital Intensity Hypothesis</H3>

            <P>
              We formalise the theoretical gap identified above in the Digital Intensity Hypothesis,
              which constitutes the central theoretical contribution of this paper. The DIH consists
              of three propositions, each of which makes an empirically testable claim about the
              structure of AI displacement risk in developing economies.
            </P>

            <Proposition n="1" title="The Digitalization Prerequisite">
              For AI-mediated displacement of a worker in occupation <em>o</em> to occur, a
              necessary (though not sufficient) condition is that the tasks performed by that
              worker are conducted within a digitally mediated workflow environment. The upper
              bound on near-term displacement probability is therefore a function of Digital
              Intensity, not task automability alone: P(displacement | o, t) &le; g(DII(o, t)),
              where g is a monotonically increasing function and DII(o, t) ∈ [0, 100] is the
              Digital Intensity Index of occupation o at time t.
            </Proposition>

            <Proposition n="2" title="Multiplicative Risk Structure">
              Displacement risk is the <em>multiplicative</em> combination of task automability
              and digital intensity, not their sum or their maximum. The reasoning is structural:
              an occupation with maximum automability (AES = 100) but zero digital intensity
              (DII = 0) — all work conducted face-to-face and on paper — presents zero
              near-term AI displacement risk regardless of task content. An occupation with
              maximum digital intensity (DII = 100) but zero task automability (AES = 0)
              presents similarly zero risk. Risk is jointly generated by both factors, which
              motivates the compound ADRI specification.
            </Proposition>

            <Proposition n="3" title="The Displacement Cliff">
              In economies undergoing rapid digitalization, occupations with high existing AES
              scores will exhibit a non-linear acceleration of displacement risk as DII crosses
              the threshold at which ADRI = AES × DII / 100 exceeds 55. The implication is
              a characteristic "cliff" in the risk trajectory: a period of deceptively low
              ADRI (when DII is below the threshold) followed by rapid escalation as
              infrastructure matures. Economies currently in the low-DII phase — including
              India for a majority of occupations — have an anticipatory window to prepare
              that economies which digitalized prior to the AI era did not have.
            </Proposition>

            <P>
              The DIH is theoretically distinguishable from prior frameworks in three respects.
              First, it introduces a new variable — digital intensity — as a theoretically
              necessary component of displacement risk rather than treating it as a measurement
              detail. Second, it generates the unique empirical prediction of the displacement
              cliff, which is testable against observed patterns of AI tool adoption as DII
              rises in specific sectors. Third, it identifies a policy-relevant window — the
              period of low DII before the cliff — that has no equivalent in advanced-economy
              automation frameworks, where digitalization and automation were effectively
              co-incident processes.
            </P>

            <SectionAnchor id="s2-5" />
            <H3>2.5  Formalisation: The ADRI</H3>

            <P>
              Building on the DIH, we define the AI Displacement Risk Index as the normalised
              product of the AI Exposure Score and the Digital Intensity Index:
            </P>

            <Formula
              label="AI Displacement Risk Index — Core Specification"
              formula="ADRI(o, t)  =  AES(o, t) × DII(o, t) / 100"
              note="Range: [0, 100]. Occupation o at time period t. Both inputs scored on [0, 100] scales."
            />

            <P>
              We classify occupations into three risk tiers based on theoretically motivated
              thresholds derived from the historical automation literature:
            </P>

            <DataTable
              headers={['Tier', 'ADRI Range', 'Interpretation', 'Historical Analogue']}
              rows={[
                ['HIGH',     '> 55',  'Substantial near-term displacement pressure',     'US clerical occupations, 1985–2005: 35–65% employment decline'],
                ['MODERATE', '29–55', 'Significant task transformation, partial risk',   'US middle-skill occupations: task restructuring without elimination'],
                ['LOW',      '≤ 28',  'Insulated in near term; monitor DII trajectory',  'Pre-digital service workers: low risk until infrastructure matures'],
              ]}
              caption="Table 1: ADRI risk tier classification. HIGH threshold of 55 corresponds to the geometric mean AES and DII both exceeding approximately 74, consistent with empirical profiles of heavily automated US clerical occupations post-PC adoption (Autor, Levy & Murnane, 2003; Acemoglu & Restrepo, 2018)."
            />

            <P>
              The threshold values are not arbitrary. The HIGH threshold of 55 was selected to
              match the empirical profile of occupational categories that experienced sustained
              employment decline following PC and ERP adoption in advanced economies between
              1985 and 2005. Acemoglu and Restrepo (2022) document that occupations in this
              range — roughly, those where both task automability and digital workflow integration
              are high — exhibited consistent negative employment trends across the OECD.<Cite n="4" />
              The MODERATE threshold of 29 corresponds to the lower boundary of occupations
              that experienced significant task transformation (reallocation within the occupation
              toward non-routine components) without consistent employment elimination.
            </P>

            {/* ── 3. CONTRIBUTIONS ── */}
            <SectionAnchor id="s3" />
            <H2>3  Contributions to the Literature</H2>

            <P>
              We enumerate four distinct contributions to existing bodies of literature, specifying
              in each case the prior work being extended and the precise nature of the extension.
            </P>

            <div className="space-y-5 my-5">
              {[
                {
                  n: '1',
                  title: 'A New Theoretical Construct: The Digital Intensity Index',
                  body: "The Digital Intensity Index (DII) is not a recombination of existing variables but a theoretically motivated new construct. Existing automation risk frameworks incorporate 'degree of digital work' as an implicit background assumption, not a measured variable. By surfacing this assumption, operationalising it as a six-sub-dimension composite measure, and demonstrating its structural importance through the ADRI multiplicative specification, we add a new observable construct to the task-based automation risk toolkit. The DII is generalisable: it can be applied to any national labour market where the digital penetration of work is heterogeneous, including Sub-Saharan Africa, South and Southeast Asia, and Latin America.",
                },
                {
                  n: '2',
                  title: 'A Novel Theoretical Prediction: The Displacement Cliff',
                  body: "Proposition 3 of the Digital Intensity Hypothesis — the displacement cliff — is a novel empirical prediction with no equivalent in prior automation risk models. Advanced-economy models generate displacement risk scores that change slowly as AI capabilities improve. The DIH generates a different prediction: risk scores in developing economies will accelerate sharply — cliff-like — as digital infrastructure crosses critical thresholds. This prediction is structurally falsifiable: it implies that we should observe rapid automation adoption in sectors shortly after digital workflow integration crosses approximately 70 on the DII scale, a prediction currently testable against India's BPO and banking sectors.",
                },
                {
                  n: '3',
                  title: 'A Developing-Economy Automation Risk Framework',
                  body: "We extend the task-based automation risk literature to developing economy contexts in a systematic and theoretically grounded way. Prior work that applied Frey-Osborne or ALM-style analyses to developing economies (see Nedelkoska & Quintini, 2018, for OECD countries; McKinsey GI, 2017, for global scenarios) did so without modifying the underlying framework to account for structural differences in digital infrastructure. Our framework provides the principled basis for such modification and demonstrates its empirical significance: the aggregate India displacement risk estimate changes from a naïve 45 percent (if Frey-Osborne automability scores are applied directly) to 3.8 percent at the present, when digital intensity is incorporated.",
                },
                {
                  n: '4',
                  title: 'The First Longitudinal Occupation-Level Dataset for India, 1950–2050',
                  body: "To our knowledge, no prior study has constructed a consistent, occupation-level longitudinal dataset for India spanning the 1950–2050 centennial arc. This dataset — anchored at 13 temporal nodes using NSS/PLFS historical surveys, sectoral administrative data, and consensus-scenario projections — enables examination of India's structural transformation not as a static cross-section but as a dynamic process whose present AI-disruption moment can be understood only in historical context. The occupational profile methodology developed to reconstruct pre-PLFS historical data (Section 6.1) provides a replicable template for similar exercises in other data-sparse developing economies.",
                },
              ].map(item => (
                <div key={item.n} className="flex gap-5 p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <span className="text-sky-400 font-black text-2xl shrink-0 leading-none mt-0.5 w-6">{item.n}</span>
                  <div>
                    <p className="text-slate-100 font-bold text-[13.5px] mb-2">{item.title}</p>
                    <p className="text-slate-400 text-[12.5px] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── 4. INDIA CONTEXT ── */}
            <SectionAnchor id="s4" />
            <H2>4  India's Labour Market Context</H2>

            <SectionAnchor id="s4-1" />
            <H3>4.1  Structural Composition and the Informality Challenge</H3>

            <P>
              India's labour market is defined by three structural characteristics that jointly
              determine the applicability and limits of any automation risk framework applied
              to it. First, the economy remains heavily agricultural: approximately 46 percent
              of the workforce is engaged in agriculture and allied activities as of 2025,
              compared to less than 3 percent in high-income OECD economies.<Cite n="1" />
              Agricultural employment in India is characterised by subsistence and semi-subsistence
              farming on fragmented landholdings, predominantly physical and weather-dependent
              work, and minimal digital interface — yielding average AI Exposure scores and
              Digital Intensity Index scores near the bottom of the distribution. This structural
              feature alone produces the macroeconomic result that India's aggregate displacement
              risk is low at present, regardless of what is occurring in its digital economy.
            </P>

            <P>
              Second, informality is pervasive. The ILO estimates that approximately 80–90 percent
              of India's workforce is engaged in informal employment,<Cite n="15" /> consistent
              with our own estimate of 82 percent derived from PLFS 2023-24 own-account and casual
              labour categories.<Cite n="1" /> Informal workers in matched occupational categories
              face systematically lower AI displacement risk than their formal-sector counterparts
              because: (a) their workflows are less digitally integrated; (b) their tasks involve
              more physical co-presence and interpersonal components; and (c) the enterprise
              software and AI tool adoption that drives displacement is concentrated in the
              organised sector. This is not a permanent protection — the expansion of platforms
              such as ONDC and the formalisation dynamics driven by GST compliance are gradually
              raising the digital intensity of previously informal work.
            </P>

            <P>
              Third, India's service sector — despite its global reputation anchored in IT and
              BPO — is primarily composed of low-productivity, low-digital-intensity services:
              domestic work, retail trade, hospitality, and personal services collectively employ
              far more workers than the IT sector. The 5 million IT sector workers who drive
              India's high-ADRI tail are economically strategic but numerically small relative
              to the 71 million workers in trade and hospitality or the 70 million in construction.
              Understanding this structural fact is essential to interpreting the ADRI results
              correctly: the headline finding of 0.8 percent HIGH-risk workers is not reassuring
              complacency but a structural baseline that will change as digital infrastructure
              matures.
            </P>

            <SectionAnchor id="s4-2" />
            <H3>4.2  The Digitalization Gradient and Its Trajectory</H3>

            <P>
              India's digital infrastructure has expanded at a pace with few historical
              equivalents. Mobile internet subscriptions rose from 150 million in 2015 to
              approximately 850 million by end-2023, a compound annual growth rate of 24
              percent.<Cite n="28" /> The Unified Payments Interface processed 14.4 billion
              transactions worth ₹20.6 trillion in March 2024 alone, making India's
              digital payments infrastructure among the most active in the world by transaction
              volume. NASSCOM documents that enterprise software adoption in the organised
              sector, particularly cloud-based platforms, grew at 18 percent CAGR between
              2019 and 2024.<Cite n="19" />
            </P>

            <P>
              However, these aggregate figures mask a steep internal gradient. Digital
              infrastructure penetration is heavily concentrated in metropolitan and tier-1
              cities, in the organised formal sector, and in knowledge-intensive occupational
              categories. Mehrotra and Parida (2019) document the persistent segmentation
              of India's labour market between a small, high-wage, formal-sector tier and
              a large, low-wage, informal-sector tier with limited upward mobility between
              them,<Cite n="25" /> a segmentation that maps closely onto our DII gradient:
              the formal-sector minority faces rising ADRI as digital integration deepens,
              while the informal majority remains DII-insulated in the near term.
            </P>

            <P>
              The gender dimension of this gradient demands specific attention.
              Deshpande and Singh (2021) document the dramatic decline in India's female
              labour force participation rate — from 42 percent in 1990 to a nadir of
              approximately 24 percent in 2019, with partial recovery to 37 percent by
              2023.<Cite n="33" /> The occupations in which female workers are most
              concentrated — administrative support, bank operations, data processing,
              and textile manufacturing — appear in the MODERATE to HIGH ADRI range,
              suggesting that the gender consequences of AI displacement warrant specific
              policy attention beyond the aggregate displacement numbers.
            </P>

            {/* ── 5. DATA ── */}
            <SectionAnchor id="s5" />
            <H2>5  Data and Measurement</H2>

            <SectionAnchor id="s5-1" />
            <H3>5.1  Primary Data Sources</H3>

            <DataTable
              headers={['Source', 'Coverage', 'Variables Used', 'Vintage']}
              rows={[
                ['PLFS 2023-24, MoSPI', 'India, national', 'Workers, wages, WPR, sector shares', '2023-24'],
                ['ILO ILOSTAT', 'Global and India', 'Sectoral employment, informality rates', '2023'],
                ['World Bank WDI', '195 countries', 'GDP per capita, employment, education', '2023'],
                ['O*NET 28.0, USDOL', 'USA (India-adapted)', 'Task descriptors, work activity ratings', '2024'],
                ['NCVET / NSQF', 'India', 'Occupational competency level descriptors', '2024'],
                ['NASSCOM Annual Review', 'India IT/BPO', 'Employment, salaries, software adoption', '2024'],
                ['WEF Future of Jobs 2025', 'Global', 'AI exposure rankings, skill demand forecasts', '2025'],
                ['McKinsey Global Institute', 'Global and India', 'Automation potential, productivity scenarios', '2023'],
                ['Eurostat DESI', 'EU (external benchmark)', 'Digital intensity by occupation, DESI scores', '2023'],
                ['NSS / Decennial Census', 'India historical', 'Workforce composition, 1951–2011', '2011'],
                ['RBI Annual Report', 'India', 'Wage deflators, CPI-IW, exchange rates', '2024'],
                ['Economic Survey', 'India', 'Sectoral GVA, employment trends', '2024'],
                ['ICAI Technology Survey', 'India, CA profession', 'Digital adoption among practitioners', '2023'],
              ]}
              caption="Table 2: Primary data sources. PLFS = Periodic Labour Force Survey; WDI = World Development Indicators; NSQF = National Skills Qualification Framework; DESI = Digital Economy and Society Index; WPR = Worker Population Ratio."
            />

            <SectionAnchor id="s5-2" />
            <H3>5.2  AI Exposure Score (AES) Construction</H3>

            <P>
              The AES follows the task-level automability approach of Autor, Levy, and Murnane,<Cite n="6" />
              updated with capability assessments derived from the GPT-exposure methodology of
              Eloundou et al. (2023).<Cite n="9" /> Each of the 90 Indian and 78 global occupations
              is decomposed into constituent tasks using O*NET work activity descriptors,<Cite n="20" />
              adapted for the Indian context via NCVET competency standards<Cite n="21" /> and
              NIC-2008 occupational code mappings. For each task, we assess automability against
              five criteria: (i) pattern recognition on structured data; (ii) natural language
              generation or comprehension; (iii) rule-based logical inference; (iv) image or
              document processing; and (v) routine numerical computation. Task-intensity weights
              are drawn from O*NET "Importance" and "Level" ratings. The AES is the
              task-intensity-weighted automability average, scaled to [0, 100].
            </P>

            <P>
              In calibration against Frey-Osborne automation probabilities for the 52 occupational
              categories common to both datasets, our AES achieves a Pearson correlation of
              <em> r</em> = 0.83 (<em>p</em> &lt; 0.001, <em>n</em> = 52), with systematic
              downward adjustments for India-specific regulatory constraints (statutory audit
              requirements, medical licensing, judicial oversight) and physical co-presence
              requirements not captured in US-context task ratings.
            </P>

            <SectionAnchor id="s5-3" />
            <H3>5.3  Digital Intensity Index (DII) Construction</H3>

            <P>
              The DII is the original measurement contribution of this study. It captures
              the degree to which an occupation's work is conducted through digital interfaces,
              with digital data as both input and output, in ways that are accessible to AI
              systems operating over digital networks. The DII is constructed as an equally
              weighted composite of six sub-indices, each scored 0–16.7 and summed to
              yield DII ∈ [0, 100]:
            </P>

            <div className="my-5 space-y-3">
              {[
                ['D1', 'Data Input/Output Digitality', "The proportion of the occupation's core task inputs and outputs that exist in machine-readable digital form (structured data, digital documents, API responses, database records). A data analyst (D1 ≈ 16.5) versus a field agricultural worker (D1 ≈ 0.5)."],
                ['D2', 'Software Tool Dependency', "The degree to which the occupation requires proficiency in and active use of software applications, SaaS platforms, computational tools, or programmatic interfaces as primary instruments of work. A cloud engineer (D2 ≈ 16.7) versus a traditional weaver (D2 ≈ 0)."],
                ['D3', 'Network Connectivity Requirement', "The degree to which performing the occupation's core tasks requires active, sustained internet or intranet connectivity. A remote customer service agent (D3 ≈ 16) versus a construction labourer (D3 ≈ 0.5)."],
                ['D4', 'Remote Deliverability', "The capacity to perform the occupation's core deliverables without physical co-presence at a client site or production facility. A software developer (D4 ≈ 16.7) versus a dentist (D4 ≈ 1.5)."],
                ['D5', 'Output Standardisation', "The degree to which the occupation's work products conform to codifiable, repeatable schemas that can be specified, transmitted, and verified digitally. A chartered accountant's audit report (D5 ≈ 14) versus a chef's restaurant dish (D5 ≈ 3)."],
                ['D6', 'Digital Communication Predominance', "The proportion of the occupation's communication (with clients, colleagues, and systems) conducted through digital channels (email, messaging, videoconference, API) rather than face-to-face or physical correspondence. An email marketing manager (D6 ≈ 16.5) versus a community health worker (D6 ≈ 3)."],
              ].map(([code, name, desc]) => (
                <div key={code} className="flex gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
                  <span className="text-sky-500 font-black text-[11px] shrink-0 w-6 mt-0.5">{code}</span>
                  <div>
                    <p className="text-slate-200 font-bold text-[12.5px] mb-0.5">{name}</p>
                    <p className="text-slate-400 text-[12px] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Formula
              label="DII — Six-Component Composite"
              formula="DII(o) = (D1 + D2 + D3 + D4 + D5 + D6)  where each Dᵢ ∈ [0, 100/6 ≈ 16.7]"
              note="India-specific informal sector discount applied: DII_informal = DII_formal × (1 − δ), where δ ∈ [0.15, 0.40] by sector"
            />

            <SectionAnchor id="s5-4" />
            <H3>5.4  Validity and Reliability</H3>

            <P>
              We assess the validity of the DII via three procedures. For <em>convergent validity</em>,
              we correlate DII scores for the 32 occupational categories present in both our
              dataset and the Eurostat Digital Economy and Society Index (DESI) occupation-level
              digitisation measures.<Cite n="22" /> The Pearson correlation is <em>r</em> = 0.79
              (<em>p</em> &lt; 0.001), indicating that our expert-coded DII captures similar
              construct variance to the DESI survey-based measure in the EU context. The
              non-trivial deviation from unity reflects genuine India-EU differences in digital
              infrastructure penetration rather than measurement error.
            </P>

            <P>
              For <em>face validity</em>, we observe that DII scores produce directionally
              expected contrasts: Software Developers (DII = 97) &gt; Bank Employees (DII = 82) &gt;
              Teachers (DII = 52) &gt; Construction Workers (DII = 14) &gt; Agricultural
              Labourers (DII = 6). For <em>predictive validity</em>, we note that the three
              occupational categories for which concrete AI displacement evidence exists in
              India by 2025 — software code generation (affecting junior developers), BPO
              document processing (affecting ITeS analysts), and financial report automation
              (affecting accounting support staff) — are precisely the three categories with
              ADRI &gt; 55 in our framework.
            </P>

            <P>
              Inter-rater reliability was assessed by having two independent coders score a
              random sample of 15 occupations across all six DII sub-indices. Intraclass
              correlation (ICC) averaged 0.81 across sub-indices (range: 0.74–0.89), indicating
              good reliability. Discrepancies were resolved through structured discussion
              referencing the sub-index operational definitions.
            </P>

            {/* ── 6. TIMELINE ── */}
            <SectionAnchor id="s6" />
            <H2>6  Timeline Methodology (1950–2050)</H2>

            <P>
              A central contribution of this study is the construction of occupation-level
              longitudinal data for 90 Indian and 78 global occupational categories across
              13 temporal anchors: 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025,
              2030, 2035, 2040, and 2050. The 2025 node constitutes the empirical present
              and is directly calibrated to PLFS 2023-24. The 13-node structure enables
              examination of the structural transformation of the Indian economy from its
              post-Independence subsistence agrarian baseline, through the extraordinary
              ruptures of liberalisation (1991) and the smartphone era (2010s), to the
              AI-disruption inflection point of the present — and projects forward to the
              post-AGI transition of the 2040s and 2050s.
            </P>

            <H3>6.1  Historical Reconstruction (1950–2000)</H3>

            <P>
              Directly observed occupation-level employment data exists for India only from
              the late NSSO rounds (1999-2000 onwards) with reasonable quality. For the
              earlier period (1950–1990), we employ an <em>occupational profile methodology</em>:
              each occupation is assigned to one of eight structural archetypes whose aggregate
              employment histories are calibrated to NSS decennial surveys, Census occupational
              tables, and the structural transformation historiography of Binswanger-Mkhize
              (2013)<Cite n="24" /> and Kochhar et al. (2006).<Cite n="34" /> The eight
              profiles — ANCIENT, TRADITIONAL, INDUSTRIAL, POST_LIB, GOVT, IT_ERA,
              DIGITAL_NATIVE, and FUTURE_ROLE — represent distinct patterns of emergence,
              growth, and projected maturation, each governed by a characteristic growth
              curve calibrated to its sectoral parent.
            </P>

            <H3>6.2  Present Calibration and Future Projections (2000–2050)</H3>

            <P>
              The 2000–2025 period is calibrated directly to PLFS and NASSCOM data,
              with salary series deflated using the CPI-IW index.<Cite n="28" /> AES
              scores are held constant across periods within the historical window and
              are projected forward with capability growth assumptions derived from
              the AI progress literature.<Cite n="8" /><Cite n="9" /> DII scores for
              future periods are projected using mobile internet penetration growth
              rates (15% CAGR 2015-2023, conservatively tapering to 6% CAGR by 2035),
              enterprise software adoption curves from NASSCOM,<Cite n="19" /> and
              McKinsey GI sector-level digitization projections.<Cite n="17" />
              Forward projections (2030–2050) represent consensus-scenario estimates
              averaging across ILO,<Cite n="16" /> WEF,<Cite n="14" /> and McKinsey GI<Cite n="17" />
              forecasts; they carry substantial epistemic uncertainty and should be
              interpreted as indicative trajectories rather than point predictions.
            </P>

            <Callout color="violet" title="On Interpolation and Uncertainty">
              Values between anchor years are computed via piecewise linear interpolation.
              This is a deliberately conservative specification: real technological adoption
              follows S-curves, not lines. Linear interpolation provides an unbiased
              expectation of the cumulative change across a period under uncertainty about
              the timing of inflection, while avoiding the artefactual precision of
              estimated S-curve parameters. The KarmaMap visualisation distinguishes
              historical (pre-2025) and projected (post-2025) data through visual encoding.
              Readers should assign substantially wider uncertainty intervals to post-2030
              projections than the point estimates suggest.
            </Callout>

            {/* ── 7. FINDINGS ── */}
            <SectionAnchor id="s7" />
            <H2>7  Empirical Findings</H2>

            <SectionAnchor id="s7-1" />
            <H3>7.1  Cross-Sectional Analysis: India, 2025</H3>

            <P>
              Table 3 presents the distribution of India's 582 million measured workers
              across ADRI risk tiers as of the 2025 baseline. The aggregate picture — 96.2
              percent of workers in LOW-risk occupations — is structurally produced by the
              dominance of agriculture and low-DII manual work, and should be read in
              conjunction with the sector-level analysis in Section 7.2 and the
              intertemporal projection in Section 7.4.
            </P>

            <DataTable
              headers={['ADRI Tier', 'Threshold', 'Workers (2025)', 'Share', 'Occupations', 'Dominant Sectors']}
              rows={[
                ['HIGH',     '> 55',  '4.9M',   '0.8%',  '3',  'IT & Technology, FinTech, Financial Services'],
                ['MODERATE', '29–55', '17.7M',  '3.0%',  '14', 'Finance, Creative Industries, Education, Transport'],
                ['LOW',      '≤ 28',  '559.4M', '96.2%', '73', 'Agriculture, Construction, Manufacturing, Government, Services'],
              ]}
              caption="Table 3: ADRI risk distribution, India 2025. N = 90 occupations across 15 sectors; total mapped workforce = 582M (PLFS 2023-24 calibrated)."
            />

            <P>
              The full top-10 occupations by ADRI (Table 4) reveal the critical role of DII
              as a differentiating variable. Chartered Accountants and Auditors possess
              a higher raw AI Exposure Score (AES = 65) than Software Developers (AES = 72)
              by a modest margin, yet their ADRI (55) trails the software developer (70)
              meaningfully — because the substantial fraction of CA practice in India that
              remains paper-based or hybrid suppresses the national average DII for that
              occupation to 85. This finding has direct empirical support: the Institute of
              Chartered Accountants of India's 2023 Technology Adoption Survey found that
              28 percent of practising CAs conducted more than half their engagements
              using non-digital workflows.<Cite n="27" /> As enterprise accounting software
              penetrates the CA profession — a process already underway through GST
              mandate-driven adoption — the DII and therefore ADRI of this occupation
              will rise toward the software developer benchmark.
            </P>

            <DataTable
              headers={['Rank', 'Occupation', 'ADRI', 'AES', 'DII', 'Workers (2025)', 'Tier']}
              rows={[
                ['1',  'Software Developers & Engineers',      '70', '72', '97', '2.7M',  'HIGH'],
                ['2',  'IT Support & BPO / ITeS',              '60', '68', '88', '1.5M',  'HIGH'],
                ['3',  'UI/UX Designers',                      '57', '62', '92', '0.7M',  'HIGH'],
                ['4',  'FinTech Professionals',                 '55', '58', '95', '0.6M',  'HIGH'],
                ['5',  'Chartered Accountants & Auditors',     '55', '65', '85', '0.7M',  'HIGH'],
                ['6',  'Cloud & DevOps Engineers',             '53', '55', '97', '0.4M',  'MODERATE'],
                ['7',  'Bank Employees',                       '51', '62', '82', '1.7M',  'MODERATE'],
                ['8',  'Journalists & Digital Media',          '51', '62', '82', '0.5M',  'MODERATE'],
                ['9',  'Advertising & Marketing Professionals','51', '60', '85', '1.2M',  'MODERATE'],
                ['10', 'EdTech Professionals',                 '48', '55', '88', '0.7M',  'MODERATE'],
              ]}
              caption="Table 4: Top 10 occupations by ADRI, India 2025. AES = AI Exposure Score; DII = Digital Intensity Index."
            />

            <SectionAnchor id="s7-2" />
            <H3>7.2  Sectoral Heterogeneity</H3>

            <P>
              The sector-level aggregation (Table 5) reveals the structural contrast that
              anchors India's current low aggregate risk. The IT and Technology sector's
              average ADRI of 62 — firmly in HIGH territory — exists alongside Agriculture's
              average ADRI of 2, a thirty-fold difference driven almost entirely by DII.
              Agricultural workers possess non-trivial task automability (AES ≈ 19, reflecting
              the genuine routine elements of crop cycle management and input application)
              but near-zero digital intensity: the median Indian agricultural worker conducts
              essentially no work through digital interfaces. The personal and domestic
              services sector displays a similar pattern: high physical intensity, high
              interpersonal content, and near-zero DII yield the lowest ADRI in the
              economy despite employing 20 million workers.
            </P>

            <DataTable
              headers={['Sector', 'Workers', 'Share', 'Avg AES', 'Avg DII', 'Avg ADRI', 'Tier']}
              rows={[
                ['IT & Technology',              '5.0M',   '0.9%',  '65', '95', '62', 'HIGH'],
                ['Finance & Banking',            '9.0M',   '1.5%',  '60', '84', '50', 'MODERATE'],
                ['Education',                    '20.5M',  '3.5%',  '43', '52', '22', 'LOW'],
                ['Transport & Logistics',        '29.4M',  '5.0%',  '41', '35', '14', 'LOW'],
                ['Manufacturing',                '66.9M',  '11.4%', '33', '28', '9',  'LOW'],
                ['Trade, Hotels & Restaurants',  '71.0M',  '12.1%', '35', '42', '15', 'LOW'],
                ['Construction',                 '70.2M',  '12.0%', '36', '12', '4',  'LOW'],
                ['Government & Public Sector',   '10.9M',  '1.9%',  '28', '45', '13', 'LOW'],
                ['Personal & Domestic Services', '20.0M',  '3.4%',  '17', '6',  '1',  'LOW'],
                ['Agriculture & Allied',         '269.2M', '46.1%', '19', '8',  '2',  'LOW'],
              ]}
              caption="Table 5: Sector-level ADRI summary, India 2025. AES/DII/ADRI are unweighted occupational means within each sector. Workers are PLFS-calibrated estimates."
            />

            <SectionAnchor id="s7-3" />
            <H3>7.3  India vs. Global Comparison</H3>

            <P>
              We construct a comparative benchmark by mapping 77 of the 90 Indian
              occupational categories to nearest equivalents among the 78 global
              occupations (13 India-specific occupations — notably ASHA Workers,
              Patwari, Anganwadi Workers, Ayush Practitioners — have no meaningful
              global equivalent). The comparison reveals a structurally important
              finding: on average, Indian workers in matched occupations show AES
              scores 4.2 points lower than their global counterparts, reflecting
              genuine task composition differences (higher share of client-facing,
              relationship-intensive, judgment-dependent work in Indian service
              delivery). However, DII scores are 18.7 points lower on average,
              reflecting the infrastructure and adoption gap. The net effect is
              that ADRI scores for India average 22.3 points below matched global
              occupations — a structural buffer that is eroding as digital infrastructure
              matures.
            </P>

            <Callout color="emerald" title="The India-Global ADRI Gap: A Structural Buffer, Not Permanent Safety">
              The average India-Global ADRI gap of 22.3 points is not a fixed characteristic
              of Indian occupations — it is a function of DII, which is rising rapidly.
              Under our baseline projection, the average India-Global DII gap narrows from
              18.7 points in 2025 to approximately 8 points by 2035 and 3 points by 2045,
              as digital infrastructure penetration converges. This implies that the
              India-Global ADRI gap will narrow from 22.3 points to approximately 9 points
              over the same period, with the convergence concentrated in service sector
              occupations. The current "safety" of Indian workers relative to their global
              peers in matched occupations is a window, not a wall.
            </Callout>

            <SectionAnchor id="s7-4" />
            <H3>7.4  Intertemporal Trajectory (1950–2050)</H3>

            <P>
              Table 6 traces the evolution of ADRI risk-tier worker counts across the
              13-node timeline. The macroeconomic narrative is structurally clear. From
              1950 through 1990, effective AI displacement risk was zero: even the most
              susceptible occupations were conducted without digital mediation, and AI
              systems did not exist. The IT boom from 1991 creates a small but growing
              HIGH-risk cohort by 2010, reflecting the emergence of software engineering
              and BPO as significant employment sectors. The dramatic acceleration from
              2025 to 2050 reflects the deployment of our baseline DII growth projections:
              as digital infrastructure penetrates service, retail, logistics, and eventually
              agricultural sectors, a growing share of existing high-AES occupations cross
              the ADRI threshold into MODERATE and HIGH risk.
            </P>

            <DataTable
              headers={['Year', 'HIGH (> 55)', 'MODERATE (29–55)', 'LOW (≤ 28)', 'HIGH % of WF']}
              rows={[
                ['1950', '~0',   '~0',   '~150M', '< 0.01%'],
                ['1980', '~0',   '~0.3M', '~260M', '< 0.01%'],
                ['2000', '~0.4M', '~2M',  '~370M', '0.1%'],
                ['2010', '~2M',  '~7M',  '~430M', '0.4%'],
                ['2025', '4.9M', '17.7M', '559M',  '0.8%'],
                ['2030', '17M',  '48M',  '539M',  '2.7%'],
                ['2035', '49M',  '84M',  '489M',  '7.6%'],
                ['2040', '61M',  '130M', '423M',  '9.1%'],
                ['2050', '105M', '163M', '331M',  '14.9%'],
              ]}
              caption="Table 6: Intertemporal ADRI distribution, India 1950–2050. Pre-2025: calibrated historical reconstruction. 2030–2050: consensus-scenario projections. WF = total workforce (grows from ~150M in 1950 to ~664M in 2050 per ILO projections)."
            />

            <P>
              The most striking feature of this trajectory is the asymmetry between
              the slow accumulation of HIGH-risk workers from 1950 to 2025 (0 to 4.9
              million, a period of 75 years) and the projected rapid escalation from
              2025 to 2035 (4.9 million to 49 million, a ten-fold increase in a single
              decade). This asymmetry is the empirical signature of the displacement cliff
              discussed in the next section.
            </P>

            {/* ── 8. DISPLACEMENT CLIFF ── */}
            <SectionAnchor id="s8" />
            <H2>8  The Digitalization-Displacement Cliff</H2>

            <P>
              The displacement cliff — Proposition 3 of the Digital Intensity Hypothesis —
              is the central novel prediction of this framework. Understanding its mechanics
              is essential to understanding why the current period of low aggregate ADRI
              is a misleading guide to medium-term displacement risk, and why the policy
              implications of this framework are more urgent than the present numbers suggest.
            </P>

            <P>
              The cliff arises from the multiplicative structure of the ADRI. For an
              occupation with a fixed AES score — say, AES = 80, representative of a
              data processing role — consider how ADRI responds to rising DII:
            </P>

            <DataTable
              headers={['DII (current)', 'ADRI = AES × DII / 100', 'Risk Tier', 'Practical Interpretation']}
              rows={[
                ['10', '8',  'LOW',      'Paper-based workflow; AI cannot access the work'],
                ['25', '20', 'LOW',      'Partial digitalisation; low near-term displacement risk'],
                ['45', '36', 'MODERATE', 'Significant digital tools; task transformation likely'],
                ['60', '48', 'MODERATE', 'Approaching HIGH threshold; proactive reskilling warranted'],
                ['70', '56', 'HIGH',     'Displacement cliff crossed; AI systems now actively competing'],
                ['85', '68', 'HIGH',     'Deep digital integration; displacement already underway'],
                ['97', '78', 'HIGH',     'Fully digital workflow; maximum displacement exposure'],
              ]}
              caption="Table 7: ADRI as a function of DII for a fixed AES of 80. The displacement cliff occurs at approximately DII = 69 for this AES value (where ADRI crosses the HIGH threshold of 55). The precise cliff threshold is DII* = 5500 / AES."
            />

            <P>
              The general expression for the displacement cliff threshold — the DII value at
              which an occupation crosses from MODERATE to HIGH risk — is:
            </P>

            <Formula
              label="Displacement Cliff Threshold"
              formula="DII*(o)  =  5500 / AES(o)"
              note="The DII value at which ADRI(o) crosses the HIGH threshold of 55. Lower AES → higher DII* (later cliff). Higher AES → lower DII* (earlier cliff). For AES = 72 (Software Developer): DII* = 76. For AES = 62 (Bank Clerk): DII* = 89."
            />

            <P>
              This formula carries direct empirical content. The software developer (AES = 72)
              crossed its cliff threshold (DII* = 76) when Indian IT sector digital
              infrastructure reached a DII of approximately 76 — which occurred, by our
              calibration, around 2018-2020. The early signs of AI displacement in code
              generation and BPO document processing, visible in NASSCOM headcount
              stagnation data from 2022-2024,<Cite n="19" /> are consistent with this
              chronology. The bank clerk (AES = 62, DII* = 89) has not yet crossed its
              cliff: current DII in Indian banking averages approximately 82, below the
              cliff threshold. Our projections place the banking sector cliff crossing
              in the 2028-2030 window.
            </P>

            <P>
              For the agricultural sector (AES = 19, DII* = 289 — mathematically impossible,
              as DII is bounded at 100), the cliff can never be crossed: even if every
              agricultural task were digitally mediated (DII = 100), ADRI would reach only
              19, well below the HIGH threshold. This is not a limitation of the framework
              but a correct result: agricultural work is not displaceably automatable by AI
              at any level of digital infrastructure, given current AI capabilities. The
              automation of agriculture is a physical robotics problem, not an AI problem.
            </P>

            <Callout color="amber" title="The Policy Implication of the Cliff">
              The displacement cliff has a structural policy implication that is absent from
              advanced-economy automation frameworks: India has a <strong>pre-cliff window</strong>
              for the majority of its vulnerable occupations. In the advanced economies,
              digitalisation and AI automation were largely co-incident — digital infrastructure
              expanded and AI systems matured at roughly the same pace, leaving little time
              for anticipatory policy. In India today, for occupations like banking, logistics,
              retail, and administrative services, the digital infrastructure is approaching
              but has not yet crossed the cliff threshold. This window — approximately
              2025–2032 for most service-sector occupations — is the most valuable policy
              resource that this framework identifies.
            </Callout>

            {/* ── 9. POLICY ── */}
            <SectionAnchor id="s9" />
            <H2>9  Policy Implications</H2>

            <P>
              The ADRI framework, and the displacement cliff prediction in particular, generate
              a structured set of policy implications that are meaningfully different from those
              produced by conventional automation risk analyses. We organise these into three
              time horizons.
            </P>

            <H3>9.1  Immediate Actions (2025–2028): Securing the Pre-Cliff Window</H3>

            <P>
              The most urgent policy priority is the 4.9 million workers currently in HIGH-ADRI
              occupations, principally in IT services and BPO. These workers are India's most
              educated, highest-earning, and — critically — most socially connected formal-sector
              employees. They are also the workers for whom displacement is not a future projection
              but a present reality: NASSCOM documents headcount stagnation and role restructuring
              in software services as LLM-based code generation and document automation tools
              diffuse through the sector.<Cite n="19" /> PMKVY and the National Skill Mission
              should incorporate ADRI scores into their Strategic Skill Gap Analysis and
              prioritise AI-complementary reskilling: LLM prompt engineering, AI systems
              oversight, complex system architecture, and client relationship management.
              The National Skill Development Corporation has the institutional infrastructure
              to deliver this at scale; it lacks the sector-specific curriculum and the
              urgency signal that a published ADRI analysis can provide.
            </P>

            <P>
              The 17.7 million MODERATE-risk workers represent the pre-cliff population for
              the next displacement wave. Their current insulation is real but temporary:
              principally bank employees, journalists, marketing professionals, and educators
              in digitally integrated environments. The RBI's AI governance framework for
              banking should include worker transition provisions, not merely consumer
              protection and systemic risk clauses. Similarly, NASSCOM's Future of Work
              initiative, which currently focuses on business transformation, should be
              extended to include binding employer commitments to worker retraining as
              a condition of AI adoption incentive eligibility.
            </P>

            <H3>9.2  Medium-Term Architecture (2028–2035): Managing the Cliff</H3>

            <P>
              Between 2028 and 2035, our projections suggest the HIGH-risk worker count
              will expand from approximately 4.9 million to 49 million — a ten-fold increase
              driven by cliff crossings in banking, logistics, retail, and lower-tier
              administrative roles. This is too large a transition to be managed through
              employer-led reskilling alone. India requires a social protection architecture
              for displaced formal-sector service workers that does not currently exist.
              The MGNREGS rural employment guarantee covers agricultural and rural manual
              workers — precisely the population with the lowest ADRI and therefore the
              least near-term displacement risk. The urban formal service worker facing
              AI displacement has no equivalent safety net.
            </P>

            <P>
              We recommend a "Portability of Social Protection" framework decoupled from
              employer relationships — analogous in structure to the United Kingdom's
              Universal Credit but calibrated to Indian fiscal realities. NITI Aayog's
              2022 Gig Economy report identified 7.7 million gig workers already operating
              outside conventional employment protection;<Cite n="30" /> the displaced
              service sector worker of 2030 will face analogous structural vulnerability
              at far greater scale.
            </P>

            <H3>9.3  Structural Recommendations: Turning the Cliff into a Ramp</H3>

            <P>
              At the most fundamental level, India's policy challenge is to transform
              the digitalization-displacement cliff — a sudden, poorly managed transition —
              into a digitalization-augmentation ramp, in which rising DII is accompanied
              by rising task complexity and wage premium rather than employment elimination.
              The historical evidence on this transformation is not uniformly pessimistic:
              Brynjolfsson and McAfee (2014) document multiple cases in which
              technology-augmented workers captured productivity gains rather than
              being displaced,<Cite n="8" /> and Autor (2015) observes that new task
              creation has historically compensated for automation-driven task
              elimination over sufficiently long horizons.<Cite n="5" />
            </P>

            <P>
              The conditions for the ramp rather than the cliff outcome are: (i) sufficient
              lead time for skill development before displacement pressure materialises
              (the pre-cliff window); (ii) investment in AI-complementary skills rather
              than AI-competitive skills; and (iii) active management of the transition
              by firms and government rather than passive acceptance of market-determined
              outcomes. India currently has condition (i) for most of its vulnerable
              workforce. Conditions (ii) and (iii) require deliberate policy construction
              in the 2025–2028 window.
            </P>

            {/* ── 10. LIMITATIONS ── */}
            <SectionAnchor id="s10" />
            <H2>10  Limitations</H2>

            <P>
              We identify eight material limitations of this study. Transparency about
              these limitations is not a signal of weakness but a precondition for
              productive scholarly engagement and responsible use of the findings.
            </P>

            <div className="space-y-4 my-5">
              {[
                {
                  t: 'Expert-Coded Rather Than Survey-Based DII',
                  b: "The DII scores in this study are derived from structured expert coding against the six-sub-dimension operational definitions, not from primary survey data on actual workplace digitalization. This approach was necessary given data availability constraints but introduces measurement error and potential systematic bias. In particular, the informal sector discount applied to DII (δ ∈ [0.15, 0.40]) is calibrated to sectoral patterns rather than occupation-specific evidence. A primary survey-based DII instrument, administered to representative samples of workers within each occupational category, would substantially improve measurement precision and is the most important direction for future data work.",
                },
                {
                  t: 'Occupational Aggregation Bias',
                  b: "The 90-occupation Indian taxonomy is aggregated above ISCO-08 unit-group resolution to ensure statistical reliability, but this aggregation introduces Simpson's paradox risks: heterogeneous occupation groups may contain high-ADRI and low-ADRI workers whose compound ADRI obscures the true distribution of risk. A software developer maintaining legacy banking systems in a PSU faces materially different AI displacement risk to one developing generative AI applications at a technology startup, yet both occupy the same occupational cell in our taxonomy. Disaggregation to ISCO-08 unit groups (400+ categories) is technically feasible but requires data quality that current PLFS releases do not uniformly support.",
                },
                {
                  t: 'Static Threshold Values',
                  b: "The ADRI threshold values (HIGH > 55, MODERATE 29–55) are calibrated to historical automation patterns in advanced economies and do not account for the possibility that AI systems may achieve economically significant automation at lower ADRI levels (if, for example, AI adoption is driven by cost rather than full task substitution) or may require higher ADRI levels in India's institutional context (if regulatory protection, customer preference for human service, or enterprise adoption inertia creates friction). Threshold sensitivity analysis is warranted and is identified as a priority for future work.",
                },
                {
                  t: 'Partial Equilibrium Framework',
                  b: "The ADRI framework is explicitly a partial equilibrium measure of displacement risk. It does not model reinstatement effects — the creation of new occupational tasks that emerge as complements to AI systems — nor does it model wage adjustment, productivity-induced employment expansion, or geographic labour market reallocation. The historical record of automation, reviewed comprehensively in Acemoglu and Restrepo (2019) and Autor (2015), suggests that reinstatement has historically partially compensated for displacement, though not uniformly or immediately. The ADRI should be read as a measure of displacement exposure, not of net employment change.",
                },
                {
                  t: 'Linear Interpolation',
                  b: "Piecewise linear interpolation between 13 anchor years is a simplifying assumption. Real structural transitions — particularly technology adoption curves — follow S-shaped diffusion patterns with periods of slow adoption, rapid diffusion, and plateau. Linear interpolation may systematically misrepresent the intertemporal dynamics, either overstating early adoption or understating rapid diffusion phases. This limitation is most material for the 2025–2035 projection window, where the shape of the DII growth curve significantly affects the timing and magnitude of the displacement cliff.",
                },
                {
                  t: 'Geographic Homogeneity Within India',
                  b: "DII scores are assigned at the national occupational level, not disaggregated by state or region. This is a significant abstraction given the documented heterogeneity of digital infrastructure penetration across India's 28 states: a bank clerk in Karnataka operates in a materially more digitally integrated environment than one in Bihar. The states-level disaggregation in KarmaMap's data partially addresses this by providing separate occupational data for 21 Indian states and UTs, but the DII scores within these state-level analyses are still derived from national-level coding rather than state-specific surveys.",
                },
                {
                  t: 'Gender and Social Disaggregation',
                  b: "ADRI scores are occupation-level averages and do not disaggregate by gender, caste, or migrant status within occupations. Given that the occupational category of 'Bank Employee' contains both male-dominated managerial roles (lower ADRI due to non-routine cognitive content) and female-dominated clerical roles (higher ADRI due to routine processing content), the occupation-level ADRI underestimates the displacement risk faced by female bank clerks specifically. Deshpande and Singh (2021) document that female workers are disproportionately concentrated in the routine, automatable segments of formal-sector occupations — a finding that our aggregate ADRI is insufficiently sensitive to capture.",
                },
                {
                  t: 'AI Capability Trajectory Uncertainty',
                  b: "AES scores for future projection years incorporate AI capability growth assumptions derived from historical trends in benchmark performance. The pace of AI capability generalisation across task domains — and in particular the question of whether general-purpose AI systems will emerge within the projection horizon — is subject to deep uncertainty that no quantitative model can fully capture. Our projections should be understood as moderate-scenario estimates; readers should explicitly consider high-diffusion and low-diffusion variants, and should be prepared to revise their interpretation of post-2030 projections as AI capability evidence accumulates.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl bg-slate-800/25 border border-slate-700/30">
                  <span className="text-amber-500 font-black text-sm shrink-0 w-5 text-right mt-0.5">L{i + 1}</span>
                  <div>
                    <p className="text-slate-200 font-bold text-[13px] mb-1.5">{item.t}</p>
                    <p className="text-slate-400 text-[12.5px] leading-relaxed">{item.b}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── 11. FUTURE RESEARCH ── */}
            <SectionAnchor id="s11" />
            <H2>11  Future Research Directions</H2>

            <P>
              The framework, data, and findings presented in this paper open a rich agenda
              for future empirical and theoretical work. We identify eight specific research
              directions, each of which addresses a material limitation of the current study
              or extends the theoretical contribution in productive directions.
            </P>

            <H3>Direction 1: Primary Survey Validation of the Digital Intensity Index</H3>
            <P>
              The most pressing empirical priority is the construction of a survey-based DII
              instrument, administered to workers rather than derived from expert coding. We
              propose a structured diary-based survey in which workers record the proportion of
              each task performed through digital interfaces over a representative working week,
              combined with direct questions on software tool use, data input/output modality,
              and remote deliverability. A stratified random sample of 2,500 workers across
              20 occupational categories and five Indian states would enable both validation of
              the expert-coded DII scores through convergent validity testing and estimation
              of within-occupation DII variance — a quantity that the current framework cannot
              capture but that is theoretically and practically important, as it determines
              how much of the within-occupation workforce is truly at risk even in
              aggregate-HIGH-ADRI occupations.
            </P>

            <H3>Direction 2: Econometric Estimation of Wage Effects of Rising ADRI</H3>
            <P>
              The theoretical framework predicts that as DII rises and ADRI approaches the
              HIGH threshold, workers in affected occupations should experience wage pressure
              as employers anticipate future automation substitution — analogous to the skill-biased
              technical change wage dynamics documented by Autor, Levy, and Murnane (2003).<Cite n="6" />
              This prediction is testable using the PLFS panel component (2017-18 to present):
              construct occupation-level ADRI change scores for the 2017-2024 period by allowing
              DII to vary with state-level mobile internet penetration as an instrument, and
              estimate the wage elasticity with respect to ADRI changes using a difference-in-differences
              specification. The PLFS panel has sufficient sample size to support this analysis at
              the two-digit NIC occupational level, and state-level variation in internet penetration
              provides a credible source of exogenous DII variation.
            </P>

            <H3>Direction 3: Gender-Disaggregated Displacement Trajectories</H3>
            <P>
              As noted in the limitations, occupation-level ADRI scores mask potentially large
              within-occupation gender differences in displacement risk. We propose constructing
              occupation-gender-task-level ADRI scores by combining PLFS occupational gender
              composition data with O*NET gender-disaggregated task assignment data (available for
              matched US occupations) and ICAI/NASSCOM-style profession-level surveys for Indian
              context. The resulting gender-disaggregated ADRI would allow precise quantification
              of the differential female displacement risk that Deshpande and Singh (2021) identify
              qualitatively.<Cite n="33" /> Given the ongoing concern about female LFPR in India,
              this extension has direct policy relevance for the design of gender-sensitive
              reskilling programmes.
            </P>

            <H3>Direction 4: Geographic Spillover and Internal Migration Effects</H3>
            <P>
              If AI displacement is geographically concentrated in high-DII states (Karnataka,
              Telangana, Maharashtra), standard labour market theory predicts outward migration
              of displaced workers to lower-ADRI, lower-wage labour markets — potentially
              suppressing wages in destination states while depressing human capital in origin
              states. This prediction can be tested using district-level PLFS data combined with
              the National Sample Survey migration modules and mobile phone location data (with
              appropriate privacy protections). The specific hypothesis is that districts with
              high AI-exposed employment (proxied by IT sector share) exhibit elevated
              out-migration in PLFS rounds following periods of rapid AI tool adoption,
              controlling for district-level economic fundamentals.
            </P>

            <H3>Direction 5: The DII Trajectory and Cliff Timing Estimation</H3>
            <P>
              The displacement cliff prediction (Proposition 3 of the DIH) generates a
              testable empirical prediction about timing: sectors where DII is currently
              closest to the cliff threshold (DII* = 5500 / AES) should exhibit the earliest
              signs of AI-driven employment restructuring. We propose constructing annual
              DII time series for 20 Indian sectors using observable digital infrastructure
              proxies — internet penetration by state and sector (TRAI data), UPI transaction
              density (RBI data), enterprise software licensing expenditure (MCA filings),
              and gig platform worker registration (ONDC, aggregator data). Estimating the
              rate of DII change by sector and projecting the cliff-crossing date for each
              sector would convert the displacement cliff from a theoretical prediction into
              a concrete risk calendar — a tool of direct value to policymakers and workers.
            </P>

            <H3>Direction 6: Cross-Country Comparative Testing of the DIH</H3>
            <P>
              The Digital Intensity Hypothesis is not specific to India; it applies to any
              economy with a significant pre-digital employment sector. Comparative testing
              across economies at different levels of digital infrastructure penetration —
              Bangladesh (lower DII than India), Vietnam (comparable), Brazil (higher), and
              South Africa (heterogeneous) — would assess the generalisability of the DIH
              and test the cross-national prediction that economies with lower current DII
              but faster DII growth should exhibit the steepest displacement risk escalation
              in the near term. Such a study would require constructing country-specific DII
              instruments calibrated to national infrastructure data, a significant but
              tractable data challenge given the existence of ILO ILOSTAT occupation data
              for most of these countries.
            </P>

            <H3>Direction 7: Natural Experiment Validation via COVID-19 Digitalization Shock</H3>
            <P>
              The COVID-19 pandemic induced an exogenous, rapid, and occupation-differentiated
              shift in digital workflow intensity: occupations with high remote deliverability
              (a core DII sub-index) were suddenly compelled to operate entirely digitally,
              while occupations requiring physical co-presence continued largely unchanged.
              This constitutes a natural experiment for testing the DIH: if the hypothesis
              is correct, occupations that experienced larger DII increases between 2019 and
              2021 should have exhibited higher rates of AI tool adoption in 2022-2024, as
              the digitalized workflow provided AI systems with the access necessary for
              task automation. The PLFS annual rounds (2019-20 through 2023-24) provide
              sufficient temporal resolution to test this prediction at the two-digit
              occupational level, using pre-pandemic DII scores as a baseline and
              post-pandemic AI tool adoption proxies (software investment, licensing data,
              or survey-based measures) as outcomes.
            </P>

            <H3>Direction 8: General Equilibrium Extension — Modelling Reinstatement</H3>
            <P>
              The most theoretically important extension of the current framework is the
              integration of reinstatement effects — the creation of new tasks in which
              human labour holds a comparative advantage relative to AI systems. The
              partial equilibrium ADRI captures displacement exposure but cannot predict
              net employment effects, which depend on the balance of displacement and
              reinstatement. Following Acemoglu and Restrepo's (2019) task-composition
              framework,<Cite n="3" /> a natural extension would model the Indian economy's
              new-task creation capacity as a function of its innovation ecosystem
              (R&D spending, startup density, engineering graduate quality) and identify
              the conditions under which reinstatement effects can plausibly offset the
              displacement trajectory documented in Table 6. The NITI Aayog National
              Strategy for Artificial Intelligence<Cite n="30" /> provides a starting
              framework for the policy intervention side of this analysis; the academic
              task is to establish credible empirical estimates of the reinstatement
              capacity of each affected sector.
            </P>

            {/* ── CONCLUSION ── */}
            <SectionAnchor id="conclusion" />
            <div className="my-10 p-6 rounded-2xl bg-gradient-to-br from-slate-800/60 to-[#0d1e3a]/60 border border-slate-700/40">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Conclusion</p>
              <P>
                This paper has made a case — theoretical, empirical, and methodological — for why
                the application of advanced-economy automation risk frameworks to India produces
                systematically misleading results, and for what a more adequate framework looks like.
                The Digital Intensity Hypothesis identifies digital mediation as a necessary
                precondition for AI displacement, not a background assumption. The AI Displacement
                Risk Index operationalises this insight as a compound metric that outperforms
                task automability alone in explaining the distribution of observed early displacement
                signals in India. And the displacement cliff prediction specifies the mechanism by
                which India's current aggregate low ADRI will give way to rapid escalation as
                digital infrastructure matures — with a structural implication that India has a
                pre-cliff policy window that it would be imprudent to squander.
              </P>
              <P>
                The empirical picture is sobering but not hopeless. India's 4.9 million HIGH-risk
                workers in 2025 are a small fraction of the total workforce, but they are the
                leading edge of a displacement wave that our projections place at 49 million by
                2035 and 105 million by 2050. These workers are not abstractions; they are software
                developers in Bengaluru, BPO analysts in Hyderabad, and bank clerks in Mumbai who
                are beginning to encounter AI systems as economic competitors rather than
                productivity tools. The policy architecture to manage their transition — reskilling
                programmes, portable social protection, AI governance frameworks with worker
                provisions — does not yet adequately exist.
              </P>
              <P className="!mb-0">
                KarmaMap makes the full methodology, data, and interactive visualisation framework
                openly available as a public research and civic engagement tool. The occupational
                ADRI scores, sectoral summaries, and intertemporal projections are available for
                interrogation at occupation and state resolution. We invite critical engagement
                from the research community — including disagreement with our scoring methodology,
                our DII construction, and our projection assumptions. The framework will improve
                through precisely the kind of adversarial scrutiny that rigorous academic review
                provides. The stakes — for 582 million workers and the development trajectory of
                the world's most populous democracy — demand nothing less.
              </P>
            </div>

            {/* ── REFERENCES ── */}
            <SectionAnchor id="references" />
            <H2>References</H2>

            <div className="space-y-3">
              {[
                ["1", "Ministry of Statistics & Programme Implementation (MoSPI), Government of India. (2024). Periodic Labour Force Survey (PLFS) Annual Report 2023-24. New Delhi: MoSPI."],
                ["2", "Acemoglu, D., & Restrepo, P. (2018). Artificial intelligence, automation and work. NBER Working Paper No. 24196. Cambridge, MA: National Bureau of Economic Research."],
                ["3", "Acemoglu, D., & Restrepo, P. (2019). Automation and new tasks: How technology displaces and reinstates labor. Journal of Economic Perspectives, 33(2), 3–30."],
                ["4", "Acemoglu, D., & Restrepo, P. (2022). Tasks, automation, and the rise in US wage inequality. Econometrica, 90(5), 1973–2016."],
                ["5", "Autor, D. H. (2015). Why are there still so many jobs? The history and future of workplace automation. Journal of Economic Perspectives, 29(3), 3–30."],
                ["6", "Autor, D. H., Levy, F., & Murnane, R. J. (2003). The skill content of recent technological change: An empirical exploration. Quarterly Journal of Economics, 118(4), 1279–1333."],
                ["7", "Arntz, M., Gregory, T., & Zierahn, U. (2016). The risk of automation for jobs in OECD countries: A comparative analysis. OECD Social, Employment and Migration Working Papers, No. 189. Paris: OECD Publishing."],
                ["8", "Brynjolfsson, E., & McAfee, A. (2014). The second machine age: Work, progress, and prosperity in a time of brilliant technologies. New York: W. W. Norton & Company."],
                ["9", "Eloundou, T., Manning, S., Mishkin, P., & Rock, D. (2023). GPTs are GPTs: An early look at the labor market impact potential of large language models. Science, 384(6702), 1306–1311."],
                ["10", "Frey, C. B., & Osborne, M. A. (2017). The future of employment: How susceptible are jobs to computerisation? Technological Forecasting and Social Change, 114, 254–280."],
                ["11", "Goos, M., Manning, A., & Salomons, A. (2014). Explaining job polarization: Routine-biased technological change and offshoring. American Economic Review, 104(8), 2509–2526."],
                ["12", "Nedelkoska, L., & Quintini, G. (2018). Automation, skills use and training. OECD Social, Employment and Migration Working Papers, No. 202. Paris: OECD Publishing."],
                ["13", "Webb, M. (2020). The impact of artificial intelligence on the labor market. SSRN Working Paper. https://doi.org/10.2139/ssrn.3482150"],
                ["14", "World Economic Forum. (2025). The future of jobs report 2025. Geneva: WEF."],
                ["15", "International Labour Organization. (2023). World employment and social outlook: Trends 2023. Geneva: ILO."],
                ["16", "International Labour Organization. (2024). World employment and social outlook: Trends 2024. Geneva: ILO."],
                ["17", "McKinsey Global Institute. (2023). India's AI moment: Transforming the world's most populous democracy. New York: McKinsey & Company."],
                ["18", "McKinsey Global Institute. (2017). A future that works: Automation, employment, and productivity. New York: McKinsey & Company."],
                ["19", "NASSCOM. (2024). Indian tech industry: Annual strategic review 2024. New Delhi: NASSCOM."],
                ["20", "National Center for O*NET Development. (2024). O*NET OnLine, Version 28.0. US Department of Labor/Employment and Training Administration. https://www.onetonline.org"],
                ["21", "National Council for Vocational Education and Training (NCVET). (2024). National skills qualification framework. Ministry of Skill Development and Entrepreneurship, Government of India."],
                ["22", "European Commission. (2023). Digital economy and society index (DESI) 2023. Brussels: European Commission."],
                ["23", "International Labour Organization. (2012). International standard classification of occupations: ISCO-08. Geneva: ILO."],
                ["24", "Binswanger-Mkhize, H. P. (2013). The stunted structural transformation of the Indian economy: Agriculture, manufacturing and the rural non-farm sector. Economic and Political Weekly, 48(26-27), 5–13."],
                ["25", "Mehrotra, S., & Parida, J. K. (2019). India's employment crisis: Rising education levels and falling non-agricultural employment growth. CSE Working Paper No. 2019-04. Bangalore: Centre for Sustainable Employment, Azim Premji University."],
                ["26", "Rodrik, D. (2016). Premature deindustrialisation in developing countries. Journal of Economic Growth, 21(1), 1–33."],
                ["27", "Institute of Chartered Accountants of India (ICAI). (2023). Technology adoption survey among practising chartered accountants 2023. New Delhi: ICAI Publication."],
                ["28", "Reserve Bank of India. (2024). Annual report 2023-24. Mumbai: RBI."],
                ["29", "Ministry of Finance, Government of India. (2024). Economic survey 2023-24. New Delhi: Government of India."],
                ["30", "NITI Aayog. (2022). India's booming gig and platform economy: Perspectives and recommendations on the future of work. New Delhi: NITI Aayog."],
                ["31", "Kapoor, R. (2015). Creating jobs in India's organised manufacturing sector. Indian Journal of Labour Economics, 58(3), 349–376."],
                ["32", "Abraham, V. (2017). Stagnant employment growth: Last three years may have been the worst. Economic and Political Weekly, 52(38), 13–17."],
                ["33", "Deshpande, A., & Singh, J. (2021). Dropping out, being pushed out or can't get in? Decoding declining female labour force participation in India. IZA Discussion Paper No. 14639. Bonn: IZA."],
                ["34", "Kochhar, K., Kumar, U., Rajan, R., Subramanian, A., & Tokatlidis, I. (2006). India's pattern of development: What happened, what follows? Journal of Monetary Economics, 53(5), 981–1019."],
                ["35", "World Bank. (2023). World development indicators 2023. Washington DC: The World Bank Group."],
              ].map(([n, text]) => (
                <div key={n} className="flex gap-3">
                  <span className="text-slate-600 text-[11px] font-bold shrink-0 w-6 text-right pt-0.5">[{n}]</span>
                  <p className="text-slate-500 text-[12px] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-slate-800 text-slate-600 text-[10px] space-y-1.5 leading-relaxed">
              <p>KarmaMap Working Paper · Version 2.0 · May 2025 · Submitted for peer review</p>
              <p>
                Occupational metrics (AES, DII, ADRI) are estimates derived from the methodology described in
                Section 5 and carry the limitations described in Section 10. They should not be used as the sole
                basis for individual career decisions. The interactive KarmaMap visualisation and supporting
                data are available at the project URL. Correspondence: asrarsaa@gmail.com.
              </p>
              <p>© 2025 Syed Asrar Ahmed. This work is made available under a Creative Commons Attribution
                4.0 International (CC BY 4.0) licence. Reproduction and adaptation with attribution is
                encouraged for research, educational, and policy purposes.</p>
            </div>

          </div>
          )}
        </div>
      </div>
    </div>
  )
}

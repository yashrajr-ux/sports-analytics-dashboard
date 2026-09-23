import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  Sliders,
  Filter,
  ShieldAlert,
  Ticket,
  ShoppingBag,
  Coffee,
  CloudSun,
  Calendar,
  Zap,
  Award,
  Activity,
  Download,
  Search,
  RefreshCw,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  PieChart,
  UserCheck,
  UserX,
  Maximize2,
  Minimize2,
  X,
  Flame,
  Gauge
} from 'lucide-react';


// Seeded random helper for deterministic mock data consistency
const createSeededRandom = (seed) => {
  let s = seed;
  return () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
};

const ZONES = ['Suite', 'Club Level', 'Lower Bowl', 'Upper Deck', 'Student / GA'];
const GAME_TYPES = ['Weekend Marquee', 'Weekend Standard', 'Weekday Night', 'Holiday Special'];
const WEATHERS = ['Clear / Sun', 'Rain / Overcast', 'Cold / Snow', 'Dome / Indoor'];
const APP_ENGAGEMENTS = ['High (Daily)', 'Medium (Matchday)', 'Low (Occasional)', 'Dormant'];
const FIRST_NAMES = ['Marcus', 'Elena', 'David', 'Sophia', 'James', 'Aaliyah', 'Carlos', 'Chloe', 'Liam', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Isabella', 'Noah', 'Mia', 'Lucas', 'Charlotte', 'Benjamin', 'Amelia'];
const LAST_NAMES = ['Vance', 'Chen', 'Miller', 'Rodriguez', 'Taylor', 'Jackson', 'Patel', 'Washington', 'Kim', 'O\'Connor', 'Brooks', 'Gomez', 'Wright', 'Foster', 'Snyder', 'Hayes', 'Nakamura', 'Sinclair', 'Dupont', 'Kowalski'];

const generateDataset = () => {
  const rng = createSeededRandom(42);
  const data = [];

  const zoneConfig = {
    'Suite': { baseVal: 380, merchRange: [80, 220], concRange: [120, 280], parkRange: [45, 75] },
    'Club Level': { baseVal: 180, merchRange: [45, 120], concRange: [65, 130], parkRange: [30, 50] },
    'Lower Bowl': { baseVal: 110, merchRange: [25, 70], concRange: [35, 80], parkRange: [20, 35] },
    'Upper Deck': { baseVal: 45, merchRange: [10, 40], concRange: [20, 50], parkRange: [15, 25] },
    'Student / GA': { baseVal: 22, merchRange: [5, 25], concRange: [15, 35], parkRange: [0, 15] }
  };

  for (let i = 1; i <= 100; i++) {
    const fanId = `FAN-${1000 + i}`;
    const fn = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const fanName = `${fn} ${ln}`;
    
    const zone = ZONES[Math.floor(rng() * ZONES.length)];
    const config = zoneConfig[zone];
    
    const gameType = GAME_TYPES[Math.floor(rng() * GAME_TYPES.length)];
    const weather = WEATHERS[Math.floor(rng() * WEATHERS.length)];
    
    // Dynamic Pricing Multiplier based on game type and demand
    let multiplier = 0.85 + rng() * 0.7;
    if (gameType === 'Weekend Marquee') multiplier += 0.35;
    if (gameType === 'Holiday Special') multiplier += 0.25;
    if (weather === 'Rain / Overcast' || weather === 'Cold / Snow') multiplier -= 0.15;
    multiplier = parseFloat(Math.max(0.6, Math.min(2.2, multiplier)).toFixed(2));

    const faceValue = config.baseVal;
    const actualPricePaid = parseFloat((faceValue * multiplier).toFixed(2));
    const ticketQty = Math.floor(rng() * 3) + 1;
    const totalTicketRev = parseFloat((actualPricePaid * ticketQty).toFixed(2));

    // Attendance probability (Suite & Club attend more; bad weather reduces lower tier attendance)
    let attendProb = 0.88;
    if (zone === 'Upper Deck' || zone === 'Student / GA') attendProb -= 0.12;
    if (weather === 'Rain / Overcast' || weather === 'Cold / Snow') attendProb -= 0.15;
    const attended = rng() < Math.max(0.45, attendProb);
    const noShow = !attended;

    // Ancillary spend (0 if no-show, but record potential leakage)
    const merchSpend = attended ? Math.floor(config.merchRange[0] + rng() * (config.merchRange[1] - config.merchRange[0])) : 0;
    const concessionSpend = attended ? Math.floor(config.concRange[0] + rng() * (config.concRange[1] - config.concRange[0])) : 0;
    const parkingSpend = attended ? Math.floor(config.parkRange[0] + rng() * (config.parkRange[1] - config.parkRange[0])) : 0;
    const totalInVenueSpend = merchSpend + concessionSpend + parkingSpend;
    const totalSpendPerVisit = parseFloat((totalTicketRev + totalInVenueSpend).toFixed(2));
    const revenuePerSeat = parseFloat((totalSpendPerVisit / ticketQty).toFixed(2));

    // Fan Sentiment & App Engagement
    const npsScore = Math.floor(rng() * 11); // 0-10
    let npsCategory = 'Passive (7-8)';
    if (npsScore >= 9) npsCategory = 'Promoter (9-10)';
    else if (npsScore <= 6) npsCategory = 'Detractor (0-6)';

    const appEngagement = APP_ENGAGEMENTS[Math.floor(rng() * APP_ENGAGEMENTS.length)];

    // Estimated CLV & Churn Risk
    let estCLV = Math.floor(1200 + rng() * 8800);
    if (zone === 'Suite') estCLV += 15000;
    if (zone === 'Club Level') estCLV += 6000;

    let churnRisk = 'Low Risk';
    if (npsScore <= 4 || appEngagement === 'Dormant' || (noShow && rng() > 0.4)) {
      churnRisk = rng() > 0.5 ? 'High Risk (At-Risk)' : 'Moderate Risk';
    } else if (npsScore <= 7) {
      churnRisk = 'Moderate Risk';
    }

    const tenureYears = Math.floor(1 + rng() * 12);
    const seatLocation = `${zone.substring(0, 2).toUpperCase()}-Sec ${Math.floor(100 + rng() * 400)}-Row ${Math.floor(1 + rng() * 30)}`;

    data.push({
      fan_id: fanId,
      fan_name: fanName,
      seating_zone: zone,
      ticket_type: ticketQty > 1 ? 'Multi-Ticket / Group' : 'Single Game Ticket',
      ticket_quantity: ticketQty,
      face_value_per_ticket: faceValue,
      dynamic_price_multiplier: multiplier,
      actual_price_paid_per_ticket: actualPricePaid,
      total_ticket_revenue: totalTicketRev,
      merch_spend: merchSpend,
      concession_spend: concessionSpend,
      parking_spend: parkingSpend,
      total_in_venue_spend: totalInVenueSpend,
      total_spend_per_visit: totalSpendPerVisit,
      revenue_per_seat: revenuePerSeat,
      attended: attended,
      no_show: noShow,
      weather_condition: weather,
      game_day_type: gameType,
      nps_score: npsScore,
      nps_category: npsCategory,
      app_engagement_level: appEngagement,
      estimated_clv: estCLV,
      churn_risk_label: churnRisk,
      tenure_years: tenureYears,
      seat_location: seatLocation
    });
  }
  return data;
};


const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

const formatPercent = (val) => {
  return `${(val * 100).toFixed(1)}%`;
};

const formatNumber = (val) => {
  return new Intl.NumberFormat('en-US').format(Math.round(val));
};


const MetricCard = ({ title, value, subtext, icon: Icon, trend, trendValue, accentColor = 'indigo' }) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30 text-indigo-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-400',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30 text-cyan-400',
    rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/30 text-rose-400',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400'
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-slate-900/80 p-5 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-slate-700 hover:translate-y-[-2px]`}>
      <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${colorMap[accentColor]} blur-2xl opacity-50 rounded-full pointer-events-none`}></div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 ${colorMap[accentColor].split(' ').pop()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
      </div>
      <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-800/80">
        <span className="text-slate-400 truncate">{subtext}</span>
        {trendValue && (
          <span className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-md text-[11px] ${
            trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
};


const BarChartCustom = ({ data, categories, title, subtitle }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxValue = Math.max(...data.flatMap(d => categories.map(c => d[c.key])), 1);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            {title}
          </h4>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: cat.color }}></span>
              <span className="text-slate-300 font-medium">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 my-auto">
        {data.map((item, idx) => (
          <div 
            key={idx} 
            className="group relative p-2.5 rounded-xl transition-all duration-200 hover:bg-slate-800/50"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-200 font-semibold">{item.label}</span>
              <span className="text-slate-400 font-mono">Total: {formatCurrency(item.total || categories.reduce((sum, c) => sum + (item[c.key] || 0), 0))}</span>
            </div>
            
            <div className="w-full bg-slate-950/80 rounded-lg h-5 p-0.5 flex gap-1 overflow-hidden border border-slate-800">
              {categories.map((cat) => {
                const val = item[cat.key] || 0;
                const widthPct = Math.max(2, (val / maxValue) * 100);
                return (
                  <div
                    key={cat.key}
                    className="h-full rounded-sm transition-all duration-500 relative group/bar"
                    style={{ 
                      width: `${widthPct}%`, 
                      backgroundColor: cat.color,
                      opacity: hoveredIdx === null || hoveredIdx === idx ? 1 : 0.4
                    }}
                  >
                    <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded border border-slate-700 whitespace-nowrap z-20 pointer-events-none shadow-lg">
                      {cat.label}: {formatCurrency(val)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const DonutChartCustom = ({ data, title, subtitle, centerLabel, centerValue }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const total = data.reduce((acc, item) => acc + item.value, 0);

  let accumulatedAngle = 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full">
      <div>
        <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-400" />
          {title}
        </h4>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-4">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const strokeDasharray = 2 * Math.PI * 38; // radius 38
              const percentage = total > 0 ? item.value / total : 0;
              const strokeDashoffset = strokeDasharray * (1 - percentage);
              const angle = accumulatedAngle;
              accumulatedAngle += percentage * 360;

              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="14"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transformOrigin: '50% 50%',
                    transform: `rotate(${angle}deg)`,
                    transition: 'all 0.5s ease',
                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.35,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center p-2 pointer-events-none">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{centerLabel}</span>
            <span className="text-lg font-extrabold text-white">{centerValue}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5">
          {data.map((item, idx) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer border ${
                  hoveredIndex === idx ? 'bg-slate-800 border-slate-700' : 'border-transparent hover:bg-slate-800/40'
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{formatNumber(item.value)}</div>
                  <div className="text-[10px] text-slate-400">{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default function App() {
  // In-memory dataset state
  const [dataset] = useState(() => generateDataset());

  // Global Filters
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedGameType, setSelectedGameType] = useState('All');
  const [selectedWeather, setSelectedWeather] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState('executive'); // executive, ancillary, sentiment, simulator

  // Modal State for Full Data Explorer
  const [isDataExplorerOpen, setIsDataExplorerOpen] = useState(false);

  // Dynamic Pricing Simulator Controls (Tab 4)
  const [simBasePrice, setSimBasePrice] = useState(120);
  const [simDemandMultiplier, setSimDemandMultiplier] = useState(1.35);
  const [simCapacityPct, setSimCapacityPct] = useState(92);
  const [simWeatherImpact, setSimWeatherImpact] = useState(0); // -15% to +15%
  const [simSelectedZone, setSimSelectedZone] = useState('Club Level');


  const filteredData = useMemo(() => {
    return dataset.filter(item => {
      if (selectedZone !== 'All' && item.seating_zone !== selectedZone) return false;
      if (selectedGameType !== 'All' && item.game_day_type !== selectedGameType) return false;
      if (selectedWeather !== 'All' && item.weather_condition !== selectedWeather) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.fan_name.toLowerCase().includes(query);
        const matchesId = item.fan_id.toLowerCase().includes(query);
        const matchesZone = item.seating_zone.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesZone) return false;
      }
      return true;
    });
  }, [dataset, selectedZone, selectedGameType, selectedWeather, searchQuery]);


  const metrics = useMemo(() => {
    const totalRecords = filteredData.length;
    if (totalRecords === 0) {
      return {
        grossRevenue: 0,
        ticketRevenue: 0,
        ancillaryRevenue: 0,
        avgSpendPerVisit: 0,
        revPerSeat: 0,
        noShowRate: 0,
        attendedCount: 0,
        noShowCount: 0,
        totalSeats: 0
      };
    }

    const grossRevenue = filteredData.reduce((acc, d) => acc + d.total_spend_per_visit, 0);
    const ticketRevenue = filteredData.reduce((acc, d) => acc + d.total_ticket_revenue, 0);
    const ancillaryRevenue = filteredData.reduce((acc, d) => acc + d.total_in_venue_spend, 0);
    const totalSeats = filteredData.reduce((acc, d) => acc + d.ticket_quantity, 0);
    
    const attendedCount = filteredData.filter(d => d.attended).length;
    const noShowCount = filteredData.filter(d => d.no_show).length;
    const noShowRate = totalRecords > 0 ? noShowCount / totalRecords : 0;

    const avgSpendPerVisit = grossRevenue / totalRecords;
    const revPerSeat = totalSeats > 0 ? grossRevenue / totalSeats : 0;

    return {
      grossRevenue,
      ticketRevenue,
      ancillaryRevenue,
      avgSpendPerVisit,
      revPerSeat,
      noShowRate,
      attendedCount,
      noShowCount,
      totalSeats
    };
  }, [filteredData]);


  const zoneRevenueBreakdown = useMemo(() => {
    return ZONES.map(zone => {
      const zoneItems = filteredData.filter(d => d.seating_zone === zone);
      const ticketRev = zoneItems.reduce((sum, d) => sum + d.total_ticket_revenue, 0);
      const inVenueRev = zoneItems.reduce((sum, d) => sum + d.total_in_venue_spend, 0);
      return {
        label: zone,
        ticketRev,
        inVenueRev,
        total: ticketRev + inVenueRev
      };
    });
  }, [filteredData]);


  const ancillaryByZoneData = useMemo(() => {
    return ZONES.map(zone => {
      const zoneItems = filteredData.filter(d => d.seating_zone === zone);
      const attendedItems = zoneItems.filter(d => d.attended);
      const attendedCount = attendedItems.length || 1;

      const foodConc = zoneItems.reduce((sum, d) => sum + d.concession_spend, 0);
      const merch = zoneItems.reduce((sum, d) => sum + d.merch_spend, 0);
      const parking = zoneItems.reduce((sum, d) => sum + d.parking_spend, 0);

      return {
        label: zone,
        concessionPerCap: foodConc / attendedCount,
        merchPerCap: merch / attendedCount,
        parkingPerCap: parking / attendedCount,
        totalPerCap: (foodConc + merch + parking) / attendedCount
      };
    });
  }, [filteredData]);


  const leakageAnalysis = useMemo(() => {
    const noShows = filteredData.filter(d => d.no_show);
    const attended = filteredData.filter(d => d.attended);

    const avgConcAttended = attended.length ? attended.reduce((sum, d) => sum + d.concession_spend, 0) / attended.length : 45;
    const avgMerchAttended = attended.length ? attended.reduce((sum, d) => sum + d.merch_spend, 0) / attended.length : 35;
    const avgParkingAttended = attended.length ? attended.reduce((sum, d) => sum + d.parking_spend, 0) / attended.length : 25;

    const lostConcession = noShows.length * avgConcAttended;
    const lostMerch = noShows.length * avgMerchAttended;
    const lostParking = noShows.length * avgParkingAttended;
    const totalLostAncillary = lostConcession + lostMerch + lostParking;

    return {
      noShowCount: noShows.length,
      lostConcession,
      lostMerch,
      lostParking,
      totalLostAncillary
    };
  }, [filteredData]);


  const sentimentData = useMemo(() => {
    const promoters = filteredData.filter(d => d.nps_category.includes('Promoter'));
    const passives = filteredData.filter(d => d.nps_category.includes('Passive'));
    const detractors = filteredData.filter(d => d.nps_category.includes('Detractor'));

    const avgSpendPromoter = promoters.length ? promoters.reduce((s, d) => s + d.total_spend_per_visit, 0) / promoters.length : 0;
    const avgSpendPassive = passives.length ? passives.reduce((s, d) => s + d.total_spend_per_visit, 0) / passives.length : 0;
    const avgSpendDetractor = detractors.length ? detractors.reduce((s, d) => s + d.total_spend_per_visit, 0) / detractors.length : 0;

    return {
      donutData: [
        { label: 'Promoters (9-10)', value: promoters.length, color: '#10b981' },
        { label: 'Passives (7-8)', value: passives.length, color: '#f59e0b' },
        { label: 'Detractors (0-6)', value: detractors.length, color: '#f43f5e' }
      ],
      promoterAvgSpend: avgSpendPromoter,
      passiveAvgSpend: avgSpendPassive,
      detractorAvgSpend: avgSpendDetractor
    };
  }, [filteredData]);

  const appEngagementMetrics = useMemo(() => {
    return APP_ENGAGEMENTS.map(level => {
      const items = filteredData.filter(d => d.app_engagement_level === level);
      const avgSpend = items.length ? items.reduce((s, d) => s + d.total_spend_per_visit, 0) / items.length : 0;
      const lowRiskCount = items.filter(d => d.churn_risk_label === 'Low Risk').length;
      const renewalProb = items.length ? (lowRiskCount / items.length) * 100 : 0;

      return {
        level: level.split(' ')[0], // High, Medium, Low, Dormant
        fullLabel: level,
        count: items.length,
        avgSpend,
        renewalProb
      };
    });
  }, [filteredData]);


  const simResults = useMemo(() => {
    const capacitySeats = 18000; // standard arena/stadium section size
    const effectiveDemandMult = simDemandMultiplier * (1 + simWeatherImpact / 100);
    const realizedTicketPrice = simBasePrice * effectiveDemandMult;
    
    const seatsSold = Math.round(capacitySeats * (simCapacityPct / 100));
    const projectedTicketRev = realizedTicketPrice * seatsSold;

    // Ancillary yield modeling: higher price slightly reduces concession per cap elasticity
    const baseAncillaryPerCap = 52.50;
    const elasticityAdjustment = Math.max(0.75, 1 - (effectiveDemandMult - 1) * 0.15);
    const realizedAncillaryPerCap = baseAncillaryPerCap * elasticityAdjustment;
    
    const projectedAncillaryRev = seatsSold * realizedAncillaryPerCap;
    const combinedTotalRevenue = projectedTicketRev + projectedAncillaryRev;

    // Baseline baseline comparison ($100 base, 1.0 mult, 85% capacity)
    const baselineSeats = capacitySeats * 0.85;
    const baselineTicketRev = 100 * baselineSeats;
    const baselineAncillaryRev = baselineSeats * baseAncillaryPerCap;
    const baselineTotalRev = baselineTicketRev + baselineAncillaryRev;

    const yieldUplift = combinedTotalRevenue - baselineTotalRev;
    const yieldUpliftPct = (yieldUplift / baselineTotalRev) * 100;

    return {
      realizedTicketPrice,
      seatsSold,
      projectedTicketRev,
      projectedAncillaryRev,
      combinedTotalRevenue,
      baselineTotalRev,
      yieldUplift,
      yieldUpliftPct,
      realizedAncillaryPerCap
    };
  }, [simBasePrice, simDemandMultiplier, simCapacityPct, simWeatherImpact, simSelectedZone]);


  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(row => 
      Object.values(row).map(val => typeof val === 'string' ? `"${val}"` : val).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sports_Yield_Optimization_Data_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-16">
      
      {}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl px-4 lg:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg lg:text-xl font-black tracking-tight text-white">
                  SPORTS FRONT-OFFICE
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Live Analytics
                </span>
              </div>
              <p className="text-xs text-slate-400">Business Database & Yield Optimization Engine</p>
            </div>
          </div>

          {/* Global Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Seating Zone Filter */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium hidden sm:inline">Zone:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Seating Zones</option>
                {ZONES.map(z => <option key={z} value={z} className="bg-slate-900 text-white">{z}</option>)}
              </select>
            </div>

            {/* Game Type Filter */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium hidden sm:inline">Game:</span>
              <select
                value={selectedGameType}
                onChange={(e) => setSelectedGameType(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Game Types</option>
                {GAME_TYPES.map(g => <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>)}
              </select>
            </div>

            {/* Weather Filter */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium hidden sm:inline">Weather:</span>
              <select
                value={selectedWeather}
                onChange={(e) => setSelectedWeather(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Weather Conditions</option>
                {WEATHERS.map(w => <option key={w} value={w} className="bg-slate-900 text-white">{w}</option>)}
              </select>
            </div>

            {/* Quick Search */}
            <div className="relative flex-1 sm:w-44">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Fan / ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Data Table Modal Toggle */}
            <button
              onClick={() => setIsDataExplorerOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/30"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View 100 Database Records</span>
            </button>
          </div>

        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">

        {/* Global Filter Bar Info / Active Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">Active Filters:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Zone: {selectedZone}</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Game: {selectedGameType}</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Weather: {selectedWeather}</span>
            <span className="text-slate-400 ml-2">({filteredData.length} records matched)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export CSV
            </button>
            <button
              onClick={() => { setSelectedZone('All'); setSelectedGameType('All'); setSelectedWeather('All'); setSearchQuery(''); }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('executive')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs lg:text-sm transition-all duration-200 ${
              activeTab === 'executive'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Executive & Yield Overview
          </button>

          <button
            onClick={() => setActiveTab('ancillary')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs lg:text-sm transition-all duration-200 ${
              activeTab === 'ancillary'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Ancillary Operations
          </button>

          <button
            onClick={() => setActiveTab('sentiment')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs lg:text-sm transition-all duration-200 ${
              activeTab === 'sentiment'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            Fan Engagement & Sentiment
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs lg:text-sm transition-all duration-200 ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Dynamic Pricing Simulator
          </button>
        </div>

        {}
        {activeTab === 'executive' && (
          <div className="space-y-6">
            
            {/* Top Level KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <MetricCard
                title="Gross Matchday Revenue"
                value={formatCurrency(metrics.grossRevenue)}
                subtext="Tickets + Ancillaries"
                icon={DollarSign}
                trend="up"
                trendValue="+14.2%"
                accentColor="emerald"
              />
              <MetricCard
                title="Total Ticket Revenue"
                value={formatCurrency(metrics.ticketRevenue)}
                subtext={`Across ${metrics.totalSeats} seats sold`}
                icon={Ticket}
                trend="up"
                trendValue="+8.6%"
                accentColor="indigo"
              />
              <MetricCard
                title="In-Venue Ancillary"
                value={formatCurrency(metrics.ancillaryRevenue)}
                subtext="F&B, Merch & Parking"
                icon={ShoppingBag}
                trend="up"
                trendValue="+18.5%"
                accentColor="purple"
              />
              <MetricCard
                title="Avg Spend Per Visit"
                value={formatCurrency(metrics.avgSpendPerVisit)}
                subtext="Per account visit"
                icon={Users}
                trend="up"
                trendValue="+5.1%"
                accentColor="cyan"
              />
              <MetricCard
                title="Revenue Per Seat (RevPAS)"
                value={formatCurrency(metrics.revPerSeat)}
                subtext="Yield per physical seat"
                icon={Award}
                trend="up"
                trendValue="+11.0%"
                accentColor="amber"
              />
              <MetricCard
                title="Turnstile No-Show Rate"
                value={formatPercent(metrics.noShowRate)}
                subtext={`${metrics.noShowCount} unused tickets`}
                icon={UserX}
                trend={metrics.noShowRate > 0.15 ? 'down' : 'up'}
                trendValue={metrics.noShowRate > 0.15 ? 'High Leakage' : 'Optimal'}
                accentColor="rose"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Ticket vs In-Venue Revenue Breakdown by Seating Zone */}
              <div className="lg:col-span-2">
                <BarChartCustom
                  title="Revenue Yield Breakdown by Seating Zone"
                  subtitle="Comparison of core gate ticket revenue versus in-venue ancillary spend"
                  data={zoneRevenueBreakdown.map(z => ({
                    label: z.label,
                    ticket: z.ticketRev,
                    ancillary: z.inVenueRev,
                    total: z.total
                  }))}
                  categories={[
                    { key: 'ticket', label: 'Ticket Revenue', color: '#6366f1' },
                    { key: 'ancillary', label: 'In-Venue Ancillary', color: '#10b981' }
                  ]}
                />
              </div>

              {/* Turnstile Occupancy & Dynamic Price Uplift Panel */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-amber-400" />
                      Yield Efficiency & Turnstiles
                    </h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Live Gate Sync
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-6">
                    Turnstile attendance efficiency direct correlation with ancillary spend capture.
                  </p>

                  {/* Turnstile Progress Card */}
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-300">Attended Fans</span>
                        <span className="text-emerald-400">{metrics.attendedCount} / {filteredData.length} ({formatPercent(filteredData.length ? metrics.attendedCount / filteredData.length : 0)})</span>
                      </div>
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700" 
                          style={{ width: `${filteredData.length ? (metrics.attendedCount / filteredData.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-300">No-Show Turnstile Deficit</span>
                        <span className="text-rose-400">{metrics.noShowCount} Fans ({formatPercent(metrics.noShowRate)})</span>
                      </div>
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-700" 
                          style={{ width: `${metrics.noShowRate * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI / Strategy Callout */}
                <div className="mt-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-indigo-200">Executive Yield Insight</h5>
                    <p className="text-[11px] text-indigo-300/80 mt-0.5 leading-relaxed">
                      Suite and Club Level accounts exhibit a <span className="font-bold text-emerald-400">2.8x higher</span> ancillary multiplier compared to Upper Deck seats. Re-allocating dynamic pricing thresholds on marquee weekend games can capture an additional $34k in F&B yield.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {}
        {activeTab === 'ancillary' && (
          <div className="space-y-6">

            {/* Ancillary Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Coffee className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Concession F&B</span>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    {formatCurrency(filteredData.reduce((s, d) => s + d.concession_spend, 0))}
                  </h3>
                  <span className="text-xs text-amber-400/90 font-medium mt-1 inline-block">
                    Per-Cap: {formatCurrency(metrics.attendedCount ? filteredData.reduce((s, d) => s + d.concession_spend, 0) / metrics.attendedCount : 0)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Merchandise & Apparel</span>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    {formatCurrency(filteredData.reduce((s, d) => s + d.merch_spend, 0))}
                  </h3>
                  <span className="text-xs text-emerald-400/90 font-medium mt-1 inline-block">
                    Per-Cap: {formatCurrency(metrics.attendedCount ? filteredData.reduce((s, d) => s + d.merch_spend, 0) / metrics.attendedCount : 0)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No-Show Ancillary Leakage</span>
                  <h3 className="text-2xl font-black text-rose-400 mt-0.5">
                    -{formatCurrency(leakageAnalysis.totalLostAncillary)}
                  </h3>
                  <span className="text-xs text-rose-300/80 font-medium mt-1 inline-block">
                    Opportunity lost from {leakageAnalysis.noShowCount} absent ticket holders
                  </span>
                </div>
              </div>
            </div>

            {/* Main Ancillary Breakdown Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Per-Cap Ancillary Spend by Seating Zone */}
              <div className="lg:col-span-2">
                <BarChartCustom
                  title="Per-Capita Ancillary Spend by Seating Zone"
                  subtitle="Average per-capita F&B, Merchandise, and VIP Parking revenue generated per attended fan"
                  data={ancillaryByZoneData.map(a => ({
                    label: a.label,
                    concession: a.concessionPerCap,
                    merch: a.merchPerCap,
                    parking: a.parkingPerCap,
                    total: a.totalPerCap
                  }))}
                  categories={[
                    { key: 'concession', label: 'Concession F&B', color: '#f59e0b' },
                    { key: 'merch', label: 'Merchandise', color: '#10b981' },
                    { key: 'parking', label: 'Parking & VIP', color: '#3b82f6' }
                  ]}
                />
              </div>

              {/* No-Show Leakage Impact Matrix */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Turnstile No-Show Leakage Breakdown
                  </h4>
                  <p className="text-xs text-slate-400 mb-6">
                    Quantifying uncaptured concession and merchandise yield caused by unused seat inventory.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <Coffee className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold text-slate-200">Lost Food & Beverage</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-rose-400">-{formatCurrency(leakageAnalysis.lostConcession)}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-slate-200">Lost Retail Merchandise</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-rose-400">-{formatCurrency(leakageAnalysis.lostMerch)}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-slate-200">Lost Parking & Add-ons</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-rose-400">-{formatCurrency(leakageAnalysis.lostParking)}</span>
                    </div>
                  </div>
                </div>

                {/* Turnstile Mitigation Action Plan */}
                <div className="mt-6 p-4 rounded-xl bg-rose-950/30 border border-rose-800/40">
                  <h5 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    Turnstile Yield Recovery Action
                  </h5>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Trigger automated mobile app push notifications 45 mins prior to kickoff offering 15% concession discounts or seat upgrade transfers for unattended digital tickets.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {}
        {activeTab === 'sentiment' && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* NPS Sentiment Distribution Donut */}
              <DonutChartCustom
                title="Net Promoter Score (NPS) Distribution"
                subtitle="Fan satisfaction categories across current filtered segment"
                data={sentimentData.donutData}
                centerLabel="Total Fans"
                centerValue={filteredData.length}
              />

              {/* NPS Category Matchday Spend Impact */}
              <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Fan NPS Category vs Average Matchday Spend
                  </h4>
                  <p className="text-xs text-slate-400 mb-6">
                    Promoters spend significantly more across all venue touchpoints compared to Detractors.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/50">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Promoter Segment</span>
                      <h3 className="text-2xl font-black text-white mt-1">{formatCurrency(sentimentData.promoterAvgSpend)}</h3>
                      <p className="text-[11px] text-slate-400 mt-1">Avg Spend Per Matchday</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Passive Segment</span>
                      <h3 className="text-2xl font-black text-white mt-1">{formatCurrency(sentimentData.passiveAvgSpend)}</h3>
                      <p className="text-[11px] text-slate-400 mt-1">Avg Spend Per Matchday</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Detractor Segment</span>
                      <h3 className="text-2xl font-black text-white mt-1">{formatCurrency(sentimentData.detractorAvgSpend)}</h3>
                      <p className="text-[11px] text-slate-400 mt-1">Avg Spend Per Matchday</p>
                    </div>
                  </div>
                </div>

                {/* Key Insight Banner */}
                <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white">Sentiment Revenue Premium</span>
                      <p className="text-[11px] text-slate-400">
                        Promoters generate <span className="text-emerald-400 font-bold">
                          {sentimentData.detractorAvgSpend > 0 ? `${(((sentimentData.promoterAvgSpend - sentimentData.detractorAvgSpend) / sentimentData.detractorAvgSpend) * 100).toFixed(0)}%` : '0%'} higher
                        </span> yield per match visit than detractors.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* App Engagement Level vs Renewal Probability */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h4 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-indigo-400" />
                Digital Mobile App Engagement vs Account Renewal Likelihood
              </h4>
              <p className="text-xs text-slate-400 mb-6">
                Active app users exhibit substantially lower churn risk and higher season-ticket renewal probability.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {appEngagementMetrics.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-200">{item.fullLabel}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                        {item.count} Fans
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-400">Average Visit Spend</span>
                        <div className="text-lg font-bold text-white">{formatCurrency(item.avgSpend)}</div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">Renewal Probability</span>
                          <span className="text-emerald-400 font-bold">{item.renewalProb.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${item.renewalProb}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {}
        {activeTab === 'simulator' && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Interactive Control Panel */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    Dynamic Pricing Simulator Controls
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Adjust ticket pricing levers, demand multipliers, and stadium capacity to model real-time yield impact.
                  </p>
                </div>

                {/* Target Zone Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Simulation Zone</label>
                  <select
                    value={simSelectedZone}
                    onChange={(e) => setSimSelectedZone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>

                {/* Slider 1: Face Value Base Price */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Base Face Value Price</span>
                    <span className="font-mono font-bold text-emerald-400">{formatCurrency(simBasePrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={simBasePrice}
                    onChange={(e) => setSimBasePrice(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>$10</span>
                    <span>$250</span>
                    <span>$500</span>
                  </div>
                </div>

                {/* Slider 2: Demand Multiplier */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Demand Multiplier (Rivalry / Day)</span>
                    <span className="font-mono font-bold text-emerald-400">{simDemandMultiplier.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={simDemandMultiplier}
                    onChange={(e) => setSimDemandMultiplier(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0.5x (Low)</span>
                    <span>1.5x (Standard)</span>
                    <span>2.5x (Marquee)</span>
                  </div>
                </div>

                {/* Slider 3: Projected Capacity */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Projected Turnstile Capacity</span>
                    <span className="font-mono font-bold text-emerald-400">{simCapacityPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="1"
                    value={simCapacityPct}
                    onChange={(e) => setSimCapacityPct(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>40%</span>
                    <span>70%</span>
                    <span>100% Sellout</span>
                  </div>
                </div>

                {/* Slider 4: Weather Factor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">Weather Adjustment Factor</span>
                    <span className="font-mono font-bold text-emerald-400">{simWeatherImpact > 0 ? `+${simWeatherImpact}%` : `${simWeatherImpact}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    step="5"
                    value={simWeatherImpact}
                    onChange={(e) => setSimWeatherImpact(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>-25% (Storm)</span>
                    <span>0% (Fair)</span>
                    <span>+25% (Ideal)</span>
                  </div>
                </div>

              </div>

              {/* Simulation Output Dashboard */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Real-time Projected Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Realized Single Ticket Price</span>
                    <div className="text-3xl font-black text-white mt-1">{formatCurrency(simResults.realizedTicketPrice)}</div>
                    <span className="text-xs text-emerald-400 font-semibold mt-2 inline-block">
                      Base: {formatCurrency(simBasePrice)} x {simDemandMultiplier.toFixed(2)}x demand
                    </span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projected Seats Sold</span>
                    <div className="text-3xl font-black text-white mt-1">{formatNumber(simResults.seatsSold)}</div>
                    <span className="text-xs text-indigo-400 font-semibold mt-2 inline-block">
                      At {simCapacityPct}% capacity utilization
                    </span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projected Ticket Revenue</span>
                    <div className="text-3xl font-black text-white mt-1">{formatCurrency(simResults.projectedTicketRev)}</div>
                    <span className="text-xs text-slate-400 mt-2 inline-block">Gate Revenue Yield</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projected In-Venue Ancillary</span>
                    <div className="text-3xl font-black text-white mt-1">{formatCurrency(simResults.projectedAncillaryRev)}</div>
                    <span className="text-xs text-amber-400 font-semibold mt-2 inline-block">
                      Per-Cap Yield: {formatCurrency(simResults.realizedAncillaryPerCap)}
                    </span>
                  </div>
                </div>

                {/* Revenue Impact Callout Banner */}
                <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Total Combined Simulated Yield</span>
                      <h2 className="text-3xl lg:text-4xl font-black text-white mt-1">
                        {formatCurrency(simResults.combinedTotalRevenue)}
                      </h2>
                      <p className="text-xs text-slate-300 mt-1">
                        Compared to static baseline model of {formatCurrency(simResults.baselineTotalRev)}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-lg px-3 py-1.5 rounded-xl">
                        <ArrowUpRight className="w-5 h-5" />
                        +{simResults.yieldUpliftPct.toFixed(1)}% Uplift
                      </div>
                      <div className="text-xs text-emerald-400 font-bold mt-1">
                        +{formatCurrency(simResults.yieldUplift)} Net Optimization Gain
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Price Elasticity Summary */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Algorithm Dynamic Multiplier Rules</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="font-semibold text-slate-300">Marquee Rivalry</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Surge +25% to +50% base multiplier for Top-3 opponents.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="font-semibold text-slate-300">Weather Discount</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Auto-applies up to -15% on upper deck in rain forecast.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="font-semibold text-slate-300">Ancillary Offset</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Protects per-cap food spend when ticket price exceeds $150.</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {}
      {isDataExplorerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-7xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-indigo-400" />
                  Off-Field Business Database (100 Sample Fan Records)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing {filteredData.length} records matching active filters. Full 68-attribute transactional schema.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
                <button
                  onClick={() => setIsDataExplorerOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Table Body */}
            <div className="p-6 overflow-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-300 font-bold sticky top-0 z-10 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Fan ID / Name</th>
                    <th className="p-3">Seating Zone</th>
                    <th className="p-3">Game Day</th>
                    <th className="p-3 text-right">Paid Ticket</th>
                    <th className="p-3 text-right">In-Venue Spend</th>
                    <th className="p-3 text-right">Total Spend</th>
                    <th className="p-3 text-center">Attended</th>
                    <th className="p-3 text-center">NPS Score</th>
                    <th className="p-3">App Engagement</th>
                    <th className="p-3">Churn Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredData.map((row) => (
                    <tr key={row.fan_id} className="hover:bg-slate-800/40 transition-colors text-slate-300">
                      <td className="p-3 font-sans font-semibold text-white">
                        <div>{row.fan_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{row.fan_id} • {row.seat_location}</div>
                      </td>
                      <td className="p-3 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-200">
                          {row.seating_zone}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-slate-300">{row.game_day_type}</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">{formatCurrency(row.total_ticket_revenue)}</td>
                      <td className="p-3 text-right text-amber-400 font-bold">{formatCurrency(row.total_in_venue_spend)}</td>
                      <td className="p-3 text-right text-white font-bold">{formatCurrency(row.total_spend_per_visit)}</td>
                      <td className="p-3 text-center">
                        {row.attended ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <UserCheck className="w-3 h-3" /> Attended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            <UserX className="w-3 h-3" /> No-Show
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.nps_score >= 9 ? 'text-emerald-400 bg-emerald-500/10' : row.nps_score >= 7 ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          {row.nps_score} / 10
                        </span>
                      </td>
                      <td className="p-3 font-sans text-slate-300">{row.app_engagement_level}</td>
                      <td className="p-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.churn_risk_label.includes('Low') 
                            ? 'text-emerald-400 bg-emerald-500/10' 
                            : row.churn_risk_label.includes('Moderate') 
                            ? 'text-amber-400 bg-amber-500/10' 
                            : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          {row.churn_risk_label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-right">
              <button
                onClick={() => setIsDataExplorerOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
              >
                Close Explorer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts'

/**
 * WHO percentile reference data (simplified for demo).
 * Real implementation would use full LMS tables.
 * Data points: age in months → weight in kg for each percentile.
 */
const WHO_WEIGHT_BOYS = [
  { age: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.7, p97: 4.2 },
  { age: 3, p3: 4.8, p15: 5.4, p50: 6.0, p85: 6.7, p97: 7.4 },
  { age: 6, p3: 6.2, p15: 7.0, p50: 7.8, p85: 8.7, p97: 9.5 },
  { age: 9, p3: 7.2, p15: 8.0, p50: 9.0, p85: 10.0, p97: 11.0 },
  { age: 12, p3: 7.8, p15: 8.8, p50: 9.7, p85: 10.8, p97: 11.8 },
  { age: 18, p3: 8.8, p15: 9.8, p50: 10.9, p85: 12.2, p97: 13.4 },
  { age: 24, p3: 9.7, p15: 10.8, p50: 12.1, p85: 13.6, p97: 15.0 },
  { age: 36, p3: 11.3, p15: 12.5, p50: 14.0, p85: 15.8, p97: 17.5 },
  { age: 48, p3: 12.7, p15: 14.1, p50: 15.9, p85: 18.0, p97: 20.1 },
  { age: 60, p3: 14.1, p15: 15.7, p50: 17.8, p85: 20.3, p97: 22.8 },
]

/**
 * Mock child growth measurements (for demo).
 */
const MOCK_CHILD_MEASUREMENTS = [
  { age: 0, weight: 3.2, label: 'Birth' },
  { age: 3, weight: 5.8, label: '3 months' },
  { age: 6, weight: 7.5, label: '6 months' },
  { age: 9, weight: 8.8, label: '9 months' },
  { age: 12, weight: 9.5, label: '12 months' },
  { age: 18, weight: 11.0, label: '18 months' },
  { age: 24, weight: 12.3, label: '24 months' },
  { age: 36, weight: 14.2, label: '3 years' },
]

// Merge WHO data with child measurements for chart
const chartData = WHO_WEIGHT_BOYS.map((who) => {
  const childPoint = MOCK_CHILD_MEASUREMENTS.find((m) => m.age === who.age)
  return {
    ...who,
    child: childPoint?.weight || null,
    ageLabel: who.age < 12 ? `${who.age}m` : `${who.age / 12}y`,
  }
})

export function GrowthChart() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-3 py-2">
        <p className="text-xs font-semibold text-foreground">Weight-for-Age (Boys)</p>
        <p className="text-[10px] text-muted-foreground">WHO Percentile Curves · Demo Child</p>
      </div>
      <div className="flex-1 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis
              dataKey="ageLabel"
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={{ stroke: 'var(--border)' }}
              label={{ value: 'Age', position: 'insideBottom', offset: -5, fontSize: 10, fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={{ stroke: 'var(--border)' }}
              label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'var(--muted-foreground)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '11px',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />

            {/* Percentile bands */}
            <Line type="monotone" dataKey="p97" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" dot={false} name="97th" />
            <Line type="monotone" dataKey="p85" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" dot={false} name="85th" />
            <Line type="monotone" dataKey="p50" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="2 2" dot={false} name="50th" />
            <Line type="monotone" dataKey="p15" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" dot={false} name="15th" />
            <Line type="monotone" dataKey="p3" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" dot={false} name="3rd" />

            {/* Child's actual measurements */}
            <Line
              type="monotone"
              dataKey="child"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: 'var(--primary)', stroke: 'var(--background)', strokeWidth: 2 }}
              name="Child"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="border-t border-border px-3 py-2">
        <p className="text-[10px] text-muted-foreground">
          📊 Child tracking at ~50th–75th percentile. Growth is on track.
        </p>
      </div>
    </div>
  )
}

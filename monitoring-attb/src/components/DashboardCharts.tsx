"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#008C45",
  "#1E3A8A",
  "#F9A825",
  "#EF4444",
  "#8B5CF6",
  "#64748B",
];

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatYAxisValue = (value: number) => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)} M`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)} Jt`;
  return value.toString();
};

export interface ChartItem {
  name: string;
  count: number;
  totalValue: number;
  [key: string]: string | number | undefined;
}

interface PieChartData {
  name: string;
  value: number;
  [key: string]: string | number | undefined;
}

interface ChartProps {
  data: ChartItem[];
}

interface PieChartProps {
  data: PieChartData[];
}

// 1. Grafik Batang
export function DistributionChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />

        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#666" }}
          axisLine={false}
          tickLine={false}
        />

        {/* Y-Axis Kiri: JUMLAH UNIT */}
        <YAxis
          yAxisId="left"
          orientation="left"
          stroke="#00A2E9"
          fontSize={11}
          axisLine={false}
          tickLine={false}
          label={{
            value: "Unit",
            angle: -90,
            position: "insideLeft",
            fill: "#00A2E9",
            fontSize: 10,
          }}
        />

        {/* Y-Axis Kanan: NILAI BUKU */}
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#1E3A8A"
          fontSize={11}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatYAxisValue}
          label={{
            value: "Nilai Buku",
            angle: 90,
            position: "insideRight",
            fill: "#1E3A8A",
            fontSize: 10,
          }}
        />

        <Tooltip
          formatter={(
            value: number | string | Array<number | string> | undefined,
            name: string | number | undefined,
          ) => {
            if (value === undefined) return "";
            if (name === "Nilai Buku (Rp)" && typeof value === "number") {
              return formatRupiah(value);
            }
            return `${value} Unit`;
          }}
          labelStyle={{ color: "#333", fontWeight: "bold" }}
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "12px",
          }}
        />

        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />

        <Bar
          yAxisId="left"
          dataKey="count"
          name="Jumlah Aset"
          fill="#00A2E9"
          radius={[4, 4, 0, 0]}
          barSize={20}
        />

        <Bar
          yAxisId="right"
          dataKey="totalValue"
          name="Nilai Buku (Rp)"
          fill="#1E3A8A"
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 2. Pie Chart
export function CompositionChart({ data }: PieChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(
            value: number | string | Array<number | string> | undefined,
          ) => {
            if (value === undefined) return [];
            if (typeof value !== "number") return [value, "Jumlah"];
            return [
              `${value} Unit (${((value / total) * 100).toFixed(1)}%)`,
              "Jumlah",
            ];
          }}
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "12px",
          }}
        />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{
            fontSize: "11px",
            paddingLeft: "10px",
            lineHeight: "24px",
            maxHeight: "200px", // Scroll jika terlalu panjang
            overflowY: "auto", // Scroll aktif
            width: "150px", // Batasi lebar
          }}
          formatter={(value) => (
            <span
              className="text-gray-600 font-medium truncate inline-block align-middle"
              style={{ maxWidth: "120px" }} // Paksa potong teks
              title={value} // Tooltip bawaan browser saat hover
            >
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

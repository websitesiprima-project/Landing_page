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
  "#00A2E9",
  "#D97706",
];

// --- MAPPING KATEGORI ASET UNTUK GRAFIK ---
const ASSET_CATEGORY_MAP: Record<string, string> = {
  "10100": "Tanah & hak atas tanah",
  "10200": "Bangunan & kelengkap",
  "10300": "Bangunan saluran air",
  "10400": "Jalan dan sepur samp",
  "10500": "Instalasi dan mesin",
  "10510": "Ins & Mesin Cina",
  "10520": "Ins & Mesin Non-Cina",
  "10600": "Plngk penyaluran TL",
  "10700": "Gardu Induk",
  "10800": "SUTT",
  "10900": "Kabel di bawah tanah",
  "11000": "Jaringan distribusi",
  "11010": "Penghantar jaringan",
  "11020": "Peralatan jaringan",
  "11030": "Tiang",
  "11100": "Gardu distribusi",
  "11110": "Gardu distribusi",
  "11120": "Fasilitas 20 KV-GI",
  "11130": "Trafo",
  "11200": "Plngk lain2 distribu",
  "11300": "Plngk pgolah data",
  "11400": "Plngk transmisi data",
  "11450": "Teleinformasi Data",
  "11500": "Perlengkapan khusus",
  "11600": "Perlengkapan telekom",
  "11700": "Perlengkapan umum",
  "11750": "Peralatan Kerja",
  "11800": "Kendaraan bermotor &",
  "11900": "Kapal & Prlngkapanya",
  "40700": "Gardu Induk",
};

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

// 1. Grafik Batang (Distribution Chart)
export function DistributionChart({ data }: ChartProps) {
  // Mapping nama kategori sebelum dirender (jika data.name berisi kode)
  const mappedData = data.map((item) => ({
    ...item,
    // Cek apakah item.name ada di map, jika ya pakai nama map, jika tidak pakai aslinya (untuk Step Status)
    name: ASSET_CATEGORY_MAP[item.name] || item.name,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={mappedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />

        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "#666" }}
          interval={0} // Tampilkan semua label
          angle={-15} // Miringkan sedikit agar muat
          textAnchor="end"
          height={60}
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
            value: "End Accounting Value (Rp)",
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
            if (
              name === "End Accounting Value (Rp)" &&
              typeof value === "number"
            ) {
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
          name="End Accounting Value (Rp)"
          fill="#1E3A8A"
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 2. Pie Chart (Composition Chart)
export function CompositionChart({ data }: PieChartProps) {
  // Mapping nama kategori sebelum dirender
  const mappedData = data.map((item) => ({
    ...item,
    name: ASSET_CATEGORY_MAP[item.name] || item.name,
  }));

  const total = mappedData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={mappedData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {mappedData.map((entry, index) => (
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
            maxHeight: "200px",
            overflowY: "auto",
            width: "150px",
          }}
          formatter={(value) => (
            <span
              className="text-gray-600 font-medium truncate inline-block align-middle"
              style={{ maxWidth: "120px" }}
              title={value}
            >
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

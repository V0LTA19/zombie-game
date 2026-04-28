"use client";

import { useMemo, useState } from "react";

type Item = {
  id: number;
  name: string;
  basePower: number;
  plus: number;
};

const ranks = [
  { name: "Er", min: 1 },
  { name: "Onbaşı", min: 5 },
  { name: "Çavuş", min: 10 },
  { name: "Teğmen", min: 20 },
  { name: "Yüzbaşı", min: 35 },
  { name: "Binbaşı", min: 55 },
  { name: "General", min: 80 },
];

const starterItems: Item[] = [
  { id: 1, name: "Taaruz Tüfeği", basePower: 120, plus: 0 },
  { id: 2, name: "Pompalı", basePower: 180, plus: 0 },
  { id: 3, name: "Zırh", basePower: 90, plus: 0 },
];

function successRate(plus: number) {
  if (plus <= 2) return 95;
  if (plus <= 4) return 75;
  if (plus <= 6) return 55;
  if (plus <= 8) return 35;
  return 20;
}

function upgradeCost(plus: number) {
  return 100 + plus * plus * 50;
}

function itemPower(item: Item) {
  return Math.floor(item.basePower * (1 + item.plus * 0.1));
}

function getRank(level: number) {
  return ranks.filter((r) => level >= r.min).at(-1)?.name ?? "Er";
}

export default function Page() {
  const [level] = useState(10);
  const [gold, setGold] = useState(2500);
  const [items, setItems] = useState<Item[]>(starterItems);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>(["Oyun başladı."]);

  const selected = items[selectedIndex];

  const totalPower = useMemo(
    () => items.reduce((sum, item) => sum + itemPower(item), 0),
    [items]
  );

  function addLog(text: string) {
    setLogs((old) => [text, ...old].slice(0, 6));
  }

  function upgrade() {
    const cost = upgradeCost(selected.plus);

    if (gold < cost) {
      addLog("Yetersiz altın.");
      return;
    }

    setGold((g) => g - cost);

    const chance = successRate(selected.plus);
    const roll = Math.random() * 100;

    if (roll <= chance) {
      setItems((old) =>
        old.map((item, index) =>
          index === selectedIndex ? { ...item, plus: item.plus + 1 } : item
        )
      );
      addLog(`${selected.name} başarıyla +${selected.plus + 1} oldu.`);
    } else {
      addLog(`${selected.name} geliştirme başarısız.`);
    }
  }

  const box = {
    background: "#18181b",
    border: "1px solid #27272a",
    borderRadius: 16,
    padding: 20,
  };

  return (
    <main style={{ minHeight: "100vh", padding: 24, background: "#09090b", color: "white" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 20 }}>
        <section style={box}>
          <h1 style={{ fontSize: 40, margin: 0 }}>Zombie Game</h1>
          <p style={{ color: "#a1a1aa" }}>Web RPG Shooter Prototype</p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div style={box}><p>Level</p><h2>{level}</h2></div>
          <div style={box}><p>Rütbe</p><h2>{getRank(level)}</h2></div>
          <div style={box}><p>Altın</p><h2>{gold}</h2></div>
        </section>

        <section style={box}>
          <h2>Envanter</h2>
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              style={{
                width: "100%",
                marginBottom: 10,
                padding: 15,
                borderRadius: 12,
                border: selectedIndex === index ? "1px solid #ef4444" : "1px solid #3f3f46",
                background: selectedIndex === index ? "#450a0a" : "#09090b",
                color: "white",
                textAlign: "left",
              }}
            >
              {item.name} +{item.plus} — Güç: {itemPower(item)}
            </button>
          ))}
        </section>

        <section style={box}>
          <h2>Artı Basma</h2>
          <p>Seçili item: {selected.name} +{selected.plus}</p>
          <p>Başarı oranı: %{successRate(selected.plus)}</p>
          <p>Maliyet: {upgradeCost(selected.plus)} altın</p>
          <p>Toplam güç: {totalPower}</p>

          <button
            onClick={upgrade}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: 0,
              background: "#b91c1c",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Geliştir
          </button>
        </section>

        <section style={box}>
          <h2>Log</h2>
          {logs.map((log, index) => (
            <div key={index} style={{ background: "#09090b", padding: 10, borderRadius: 8, marginBottom: 8 }}>
              {log}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

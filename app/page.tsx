"use client";

import React, { useMemo, useState } from "react";

const ranks = [
  { name: "Er", min: 1 },
  { name: "Onbaşı", min: 5 },
  { name: "Çavuş", min: 10 },
  { name: "Astsubay", min: 18 },
  { name: "Teğmen", min: 28 },
  { name: "Yüzbaşı", min: 42 },
  { name: "Binbaşı", min: 60 },
  { name: "Albay", min: 80 },
  { name: "General", min: 100 },
];

const baseItems = [
  { id: 1, name: "Taaruz Tüfeği", basePower: 120 },
  { id: 2, name: "Pompalı", basePower: 180 },
  { id: 3, name: "Zırh", basePower: 90 },
];

function successRate(plus: number) {
  if (plus <= 2) return 95;
  if (plus <= 4) return 75;
  if (plus <= 6) return 55;
  if (plus <= 8) return 35;
  if (plus <= 10) return 20;
  return 10;
}

function upgradeCost(plus: number) {
  return 100 + plus * plus * 50;
}

function power(item: any) {
  return Math.floor(item.basePower * (1 + item.plus * 0.1));
}

function getRank(level: number) {
  return ranks.filter(r => level >= r.min).at(-1);
}

export default function Page() {
  const [level, setLevel] = useState(10);
  const [gold, setGold] = useState(2000);
  const [items, setItems] = useState(
    baseItems.map(i => ({ ...i, plus: 0 }))
  );
  const [selected, setSelected] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const current = items[selected];

  function addLog(text: string) {
    setLog(prev => [text, ...prev.slice(0, 5)]);
  }

  function upgrade() {
    const cost = upgradeCost(current.plus);
    if (gold < cost) {
      addLog("Para yetmiyor");
      return;
    }

    const chance = successRate(current.plus);
    const roll = Math.random() * 100;

    setGold(g => g - cost);

    if (roll < chance) {
      setItems(items.map((i, idx) =>
        idx === selected ? { ...i, plus: i.plus + 1 } : i
      ));
      addLog("Başarılı!");
    } else {
      addLog("Başarısız!");
    }
  }

  const totalPower = useMemo(
    () => items.reduce((sum, i) => sum + power(i), 0),
    [items]
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Zombie Game</h1>

      <p>Level: {level} ({getRank(level)?.name})</p>
      <p>Gold: {gold}</p>
      <p>Total Power: {totalPower}</p>

      <hr />

      <h2>Items</h2>
      {items.map((item, i) => (
        <div key={item.id} onClick={() => setSelected(i)} style={{ cursor: "pointer", marginBottom: 10 }}>
          {item.name} +{item.plus} (Power: {power(item)})
        </div>
      ))}

      <hr />

      <h2>Upgrade</h2>
      <p>{current.name} +{current.plus}</p>
      <p>Chance: %{successRate(current.plus)}</p>
      <p>Cost: {upgradeCost(current.plus)}</p>

      <button onClick={upgrade}>Upgrade</button>

      <hr />

      <h2>Log</h2>
      {log.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}

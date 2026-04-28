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

  const totalPower = useMemo(() => {
    return items.reduce((sum, item) => sum + itemPower(item), 0);
  }, [items]);

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

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
          <h1 className="text-4xl font-bold">Zombie Game</h1>
          <p className="text-zinc-400 mt-2">Web RPG Shooter Prototype</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-zinc-900 p-5 border border-zinc-800">
            <p className="text-zinc-400">Level</p>
            <h2 className="text-2xl font-bold">{level}</h2>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-5 border border-zinc-800">
            <p className="text-zinc-400">Rütbe</p>
            <h2 className="text-2xl font-bold">{getRank(level)}</h2>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-5 border border-zinc-800">
            <p className="text-zinc-400">Altın</p>
            <h2 className="text-2xl font-bold">{gold}</h2>
          </div>
        </section>

        <section className="rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">Envanter</h2>

          <div className="space-y-3">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                className={`w-full text-left rounded-xl p-4 border ${
                  selectedIndex === index
                    ? "border-red-500 bg-red-950"
                    : "border-zinc-700 bg-zinc-950"
                }`}
              >
                <div className="flex justify-between">
                  <span>
                    {item.name} +{item.plus}
                  </span>
                  <span>Güç: {itemPower(item)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">Artı Basma</h2>

          <p>Seçili item: {selected.name} +{selected.plus}</p>
          <p>Başarı oranı: %{successRate(selected.plus)}</p>
          <p>Maliyet: {upgradeCost(selected.plus)} altın</p>
          <p>Toplam güç: {totalPower}</p>

          <button
            onClick={upgrade}
            className="mt-4 rounded-xl bg-red-700 px-6 py-3 font-bold hover:bg-red-600"
          >
            Geliştir
          </button>
        </section>

        <section className="rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">Log</h2>
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="rounded-lg bg-zinc-950 p-3">
                {log}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

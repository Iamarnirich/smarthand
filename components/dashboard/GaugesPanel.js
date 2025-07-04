"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRapport } from "@/contexts/RapportContext";

export default function GaugesPanel({ data, range = "all" }) {
  const { rapport } = useRapport();

  const stats = useMemo(() => {
    const filtreUSDK = (str) =>
      typeof str === "string" && str.toLowerCase().includes("usdk");

    if (rapport === "defensif") {
      let possessionsAdv = 0,
        butsRecus = 0,
        apAdv = 0,
        geAdv = 0,
        butsAP = 0,
        butsGE = 0,
        SupAdv = 0,
        butsInf = 0,
        tirDuel = 0,
        tirDuelSecteurs = 0,
        tirDuelReussi = 0;

      data.forEach((e) => {
        const action = e.nom_action?.toLowerCase() || "";
        const resultat = e.resultat_limoges?.toLowerCase() || "";
        const secteur = e.secteur?.toLowerCase() || "";
        const nombre = e.nombre?.toLowerCase() || "";

        const isAdverse =
          resultat.includes("limoges") || action.includes("limoges");

        if (isAdverse) {
          if (action.includes("possession limoges")) possessionsAdv++;
          if (resultat.includes("but limoges")) butsRecus++;

          const isAP = action.includes("attaque limoges");
          const isGE =
            action.includes("ca limoges") ||
            action.includes("er limoges") ||
            action.includes("mb limoges") ||
            action.includes("transition limoges");

          if (isAP) {
            apAdv++;
            if (resultat.includes("but limoges")) butsAP++;
          }
          if (isGE) {
            geAdv++;
            if (resultat.includes("but limoges")) butsGE++;
          }

          if (nombre.includes("supériorité")) {
            SupAdv++;
            if (resultat.includes("but limoges")) butsInf++;
          }

          if (
            ["aile gauche", "aile droit", "central 6m", "1-2d", "1-2g"].some(
              (s) => secteur.includes(s)
            )
          ) {
            tirDuelSecteurs++;
          }

          if (secteur.includes("central 6m")) {
            tirDuel++;
            if (resultat.includes("but")) tirDuelReussi++;
          }
        }
      });

      return [
        {
          label: "Efficacité déf Globale",
          value:
            possessionsAdv > 0 ? (1 - butsRecus / possessionsAdv) * 100 : 0,
          count: `${possessionsAdv - butsRecus}/${possessionsAdv}`,
          color: "#D4AF37",
        },
        {
          label: "Efficacité déf Placée",
          value: apAdv > 0 ? (1 - butsAP / apAdv) * 100 : 0,
          count: `${apAdv - butsAP}/${apAdv}`,
          color: "#D4AF37",
        },
        {
          label: "Efficacité déf Grand Espace",
          value: geAdv > 0 ? (1 - butsGE / geAdv) * 100 : 0,
          count: `${geAdv - butsGE}/${geAdv}`,
          color: "#D4AF37",
        },
        {
          label: "Eff. en Inf. Numérique",
          value: SupAdv > 0 ? (1 - butsInf / SupAdv) * 100 : 0,
          count: `${SupAdv - butsInf}/${SupAdv}`,
          color: "#D4AF37",
        },
        {
          label: "% Tirs en Duel reçus",
          value: apAdv > 0 ? (tirDuelSecteurs / apAdv) * 100 : 0,
          count: `${tirDuelSecteurs}/${apAdv}`,
          color: "#D4AF37",
        },
        {
          label: "% Réussite Duel Adv",
          value: tirDuel > 0 ? (tirDuelReussi / tirDuel) * 100 : 0,
          count: `${tirDuelReussi}/${tirDuel}`,
          color: "#D4AF37",
        },
      ];
    }

    // Rapport offensif
    let tirs = 0,
      tirsReussis = 0,
      tirsRates = 0;
    let possessions = 0;
    let attaquesPlacees = 0,
      totalAttaques = 0;
    let caSuccess = 0,
      caTotal = 0;
    let grandespace = 0,
      getotal = 0;
    let engagementRapide = 0;
    let supNumSuccess = 0,
      supNumTotal = 0;
    let egalNumSuccess = 0,
      egalNumTotal = 0;
    let tirs7mReussis = 0,
      tirs7mTotal = 0;
    let duelSuccess = 0,
      duelTotal = 0;

    data.forEach((e) => {
      const action = e.nom_action?.toLowerCase() || "";
      const resultat = e.resultat_cthb?.toLowerCase() || "";
      const secteur = e.secteur?.toLowerCase() || "";
      const nombre = e.nombre?.toString().toLowerCase() || "";

      if (!resultat.includes("usdk") && !action.includes("usdk")) return;

      if (action.includes("tir ") || resultat.includes("tir ")) tirs++;
      if (action.includes("possession usdk")) possessions++;

      if (resultat.includes("but usdk")) tirsReussis++;
      if (
        resultat.includes("tir hc") ||
        resultat.includes("tir contr") ||
        resultat.includes("tir arrêt")
      )
        tirsRates++;

      if (action.includes("attaque ")) {
        totalAttaques++;
        if (action.includes("attaque usdk")) attaquesPlacees++;
      }

      if (
        action.includes("ca") ||
        action.includes("contre") ||
        action.includes("montée de balle")
      ) {
        caTotal++;
        if (resultat.includes("but")) caSuccess++;
      }

      if (
        action.includes("ca") ||
        action.includes("er") ||
        action.includes("mb") ||
        action.includes("transition")
      ) {
        getotal++;
        if (
          action.includes("ca usdk") ||
          action.includes("er usdk") ||
          action.includes("mb usdk") ||
          action.includes("transition usdk")
        )
          grandespace++;
      }

      if (action.includes("er usdk")) engagementRapide++;

      if (nombre.includes("supériorité")) {
        supNumTotal++;
        if (resultat.includes("but")) supNumSuccess++;
      } else {
        egalNumTotal++;
        if (resultat.includes("but")) egalNumSuccess++;
      }

      if (secteur.includes("7m")) {
        tirs7mTotal++;
        if (resultat.includes("but")) tirs7mReussis++;
      }

      if (secteur.includes("central 6m")) {
        duelTotal++;
        if (resultat.includes("but")) duelSuccess++;
      }
    });

    return [
      {
        label: "EFF %",
        value: possessions > 0 ? (tirs / possessions) * 100 : 0,
        count: `${tirs}/${possessions}`,
        color: "#D4AF37",
      },
      {
        label: "% Attaque Placée",
        value: totalAttaques > 0 ? (attaquesPlacees / totalAttaques) * 100 : 0,
        count: `${attaquesPlacees}/${totalAttaques}`,
        color: "#D4AF37",
      },
      {
        label: "EFF Tirs %",
        value: (tirsReussis / (tirsReussis + tirsRates || 1)) * 100,
        count: `${tirsReussis}/${tirsReussis + tirsRates}`,
        color: "#D4AF37",
      },
      {
        label: "Engagement Rapide",
        value: engagementRapide > 0 ? 100 : 0,
        count: `${engagementRapide}/${engagementRapide}`,
        color: "#D4AF37",
      },
      {
        label: "Supériorité Num.",
        value: supNumTotal > 0 ? (supNumSuccess / supNumTotal) * 100 : 0,
        count: `${supNumSuccess}/${supNumTotal}`,
        color: "#D4AF37",
      },
      {
        label: "EG 6vs6",
        value: egalNumTotal > 0 ? (egalNumSuccess / egalNumTotal) * 100 : 0,
        count: `${egalNumSuccess}/${egalNumTotal}`,
        color: "#D4AF37",
      },
      {
        label: "Buts Sur 7 Mètres",
        value: tirs7mTotal > 0 ? (tirs7mReussis / tirs7mTotal) * 100 : 0,
        count: `${tirs7mReussis}/${tirs7mTotal}`,
        color: "#D4AF37",
      },
      {
        label: "% Duel direct VS GB",
        value: duelTotal > 0 ? (duelSuccess / duelTotal) * 100 : 0,
        count: `${duelSuccess}/${duelTotal}`,
        color: "#D4AF37",
      },
    ];
  }, [data, rapport]);
  const displayedStats = useMemo(() => {
    if (range === "left") return stats.slice(0, 3);
    if (range === "right") return stats.slice(3, 6);
    if (range === "bottom-left") return stats.slice(6, 7);
    if (range === "bottom-right") return stats.slice(7, 8);
    return stats;
  }, [stats, range]);

  return (
    <div
      className={`grid gap-4 ${
        range === "bottom-left" || range === "bottom-right"
          ? "grid-cols-1"
          : "grid-cols-1"
      }`}
    >
      {displayedStats.map((g, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
          className="bg-[#ffffff] border border-[#E4CDA1] rounded-2xl p-4 w-full max-w-[190px] flex flex-col items-center shadow transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          <p className="text-[13px] text-gray-700 font-semibold mb-1 tracking-wide">
            {g.count}
          </p>
          <div className="w-24 h-24">
            <CircularProgressbarWithChildren
              value={g.value}
              maxValue={100}
              circleRatio={0.5}
              styles={buildStyles({
                rotation: 0.75,
                trailColor: "#f0f0f0",
                pathColor: g.color,
                strokeLinecap: "round",
              })}
            >
              <div className="text-sm mt-3 font-bold text-[#1a1a1a]">
                {`${g.value.toFixed(0)}%`}
              </div>
            </CircularProgressbarWithChildren>
          </div>
          <p className="mt-1 text-[12px] text-center font-medium text-gray-800 leading-snug">
            {g.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

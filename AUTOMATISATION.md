# 🤖 SITEVITRINE - AUTOMATISATION COMPLÈTE

**Dernière mise à jour:** 2026-03-02 11:21  
**Statut:** ✅ 100% Automatisé

---

## ⚙️ FLUX AUTOMATIQUE

### 📅 Quotidien

| Heure | Action | Script | Log |
|-------|--------|--------|-----|
| **08h00** | Healthcheck (vérifie que tout va bien) | `healthcheck.sh` | `logs/alerts.log` |
| **09h00** | Fetch prospects + Génération 10 sites | `run-prospection.sh 10` | `logs/cron.log` |
| **09h10** | Déploiement GitHub Pages automatique | `deploy-auto.sh` | `logs/cron.log` |
| **17h30** | Génération 20 prospects + Envoi SMS | `run-prospection.sh 20 --send-sms` | `logs/cron-sms.log` |

---

## 📁 FICHIERS CLÉS

| Fichier | Rôle |
|---------|------|
| `scripts/run-prospection.sh` | Script principal (fetch, filter, generate, SMS) |
| `scripts/deploy-auto.sh` | Déploiement automatique GitHub Pages |
| `scripts/healthcheck.sh` | Monitoring quotidien |
| `scripts/src/send-sms.js` | Envoi SMS via Brevo |
| `scripts/src/filter-prospects-auto.js` | Filtrage avec fix UTF-8 |
| `logs/cron.log` | Log des opérations matinales |
| `logs/cron-sms.log` | Log des envois SMS |
| `logs/alerts.log` | Alertes healthcheck |

---

## 🔧 CONFIGURATION

### Domaine
- **Site:** `thedigitaldna.fr`
- **URL pattern:** `thedigitaldna.fr/site/1`, `thedigitaldna.fr/site/2`, etc.
- **Fallback:** `nadirdna.github.io/sitevitrine-sms-campaign/sms-campaign-X/`

### SMS (Brevo)
- **Sender:** `Digital DNA`
- **Template:**
```
Bonjour,

J'ai vu que contrairement à vos concurrents, vous n'aviez pas de site internet. Je viens de vous en réaliser un :
thedigitaldna.fr/site/1

N'hésitez pas à me faire savoir si vous êtes intéressé.

Nadir
06 20 85 93 62
```

### Google Sheets
- **Sheet ID:** `1rleRNrHQ7dG_oSwG1jsSMLtMD3B9Hpu5O5090yPfubg`
- **Statut:** Mis à jour automatiquement après SMS

---

## 📞 INTERVENTION HUMAINE REQUISE

**Seulement si:**
- ✅ Un prospect appelle (tu réponds)
- ⚠️ Alerte dans `logs/alerts.log`
- ⚠️ Plus de prospects dans le Sheets

**Pas besoin d'intervenir pour:**
- ❌ Lancer les crons (automatique)
- ❌ Déployer les sites (automatique)
- ❌ Envoyer les SMS (automatique)
- ❌ Mettre à jour le Sheets (automatique)

---

## 🔍 COMMANDES UTILES

```bash
# Voir les logs en temps réel
tail -f /home/nadir/Bureau/SiteVitrine/logs/cron.log

# Vérifier les crons
crontab -l

# Tester déploiement manuel
cd /home/nadir/Bureau/SiteVitrine/scripts && ./deploy-auto.sh

# Vérifier GitHub Pages
curl -I https://nadirdna.github.io/sitevitrine-sms-campaign/

# Voir dernier healthcheck
cat /home/nadir/Bureau/SiteVitrine/logs/alerts.log | tail -20
```

---

**🎉 AUTOMATISATION TERMINÉE**

Tu n'as plus rien à faire sauf répondre aux appels des prospects !

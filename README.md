# Basha-AE

Claude to Mac lo unna **After Effects** ni direct ga control cheyyadaniki setup.

## Okkasari cheyyalsina setup
1. **After Effects** open cheyandi. Taruvata **After Effects → Settings → Scripting & Expressions** lo
   ✅ **"Allow Scripts to Write Files and Access Network"** tick cheyandi.
2. **Claude Desktop app** lo **Code** tab open cheyandi. Environment **Local** select chesi, ee repo ni (`~/Basha-AE`) folder ga choose cheyandi.
3. Claude modatisari After Effects ni touch chesinappudu Mac lo
   *"Claude wants to control Adobe After Effects"* ani adugutundi. **OK** nokkandi.
   (Porapatuna "Don't Allow" nokkite: **System Settings → Privacy & Security → Automation** lo Claude kinda After Effects ni on cheyandi.)

## Taruvata
Claude ki mee maatallo cheppandi, udaharanaki *"1080x1920 reel lo naa peru gold color lo zoom avutu raavali"*.
Claude script raasi, After Effects lo direct ga run chesi, result check chestundi.

## Files
- `bridge/ae_run.sh`: After Effects lo `.jsx` run chestundi
- `bridge/ae_info.jsx`: project lo em undo (comps, layers) Claude ki chupistundi
- `scripts/`: Claude raasina scripts

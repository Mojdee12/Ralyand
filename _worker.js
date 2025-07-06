// @ts-ignore
async function MainConfig() {
  globalThis.uzerID = "3ed91cef-a105-4d34-8094-4cfb85498a96";
  globalThis.qrexyIP = atob('Y2hpZ2FhZ28udjYubmF2eQ=='); // تغییر به chigaago.v6.navy
  globalThis.fixedIPs = ["45.135.165.245", "23.108.217.103", "31.214.175.108", "23.94.43.51", "5.78.114.254"]; // آی‌پی‌های ثابت
  globalThis.allPorts = [...new Set([
    "443",
  ])];

  // URL فایل متنی پیش‌فرض (جایگزین کنید)
  const IP_URL_TXT = 'https://raw.githubusercontent.com/Mojdee12/Ralyand/refs/heads/main/ips.txt';
  try {
    const response = await fetch(IP_URL_TXT);
    if (response.ok) {
      const text = await response.text();
      const newIPs = text.split('\n').map(ip => ip.trim()).filter(ip => ip.length > 0 && isValidIP(ip));
      globalThis.fixedIPs = [...new Set([...globalThis.fixedIPs, ...newIPs])];
    }
  } catch (error) {
    console.error('Error fetching IPs from IP_URL_TXT:', error);
  }
}

function WebConfig() {
  globalThis.ThisVersion = "3.4.3"; // نسخه آپدیت‌شده
  globalThis.AccessSubscription = "_SubscriptionURL_";
  globalThis.AccessAdvancedConfig = "_AdvancedConfigURL_";
  globalThis.fpaths = 'js,css,assets,wp-content,themes,app,cdn,jquery,live';
  globalThis.CleanIPDomain = "time.is";
}

function isValidIP(ip) {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

export default {
  async fetch(request, env) {
    try {
      await MainConfig();
      globalThis.UzKey = env.UUID || globalThis.uzerID;
      globalThis.CLxIP = env.PROXYIP || globalThis.qrexyIP;

      if (!isValidUUID(globalThis.UzKey))
        throw new Error(`Please register UUID first.`);

      const url = new URL(request.url);
      globalThis.pathName = url.pathname;

      if (globalThis.pathName.startsWith("/url-")) {
        var TnlSecKey = "/url-" + globalThis.UzKey.split('-')[0] + "/";
        if (globalThis.pathName.startsWith(TnlSecKey)) {
          return await hTnlReq(request, globalThis.pathName.replaceAll(TnlSecKey, ""));
        }
      }

      const upgradeHeader = request.headers.get('Upgrade');
      if (!upgradeHeader || upgradeHeader !== 'websocket') {
        WebConfig();
        globalThis.hostName = request.headers.get('Host');
        if (globalThis.AccessAdvancedConfig == "_AdvancedConfigURL_") {
          globalThis.AccessAdvancedConfig = globalThis.UzKey;
        }
        if (globalThis.AccessSubscription == "_SubscriptionURL_") {
          globalThis.AccessSubscription = 'sub/' + globalThis.UzKey;
        }
        const GetParams = new URLSearchParams(url.search);
        globalThis.GetPath = GetParams.get("path");
        globalThis.CnfgName = "Ralysnd";

        switch (globalThis.pathName) {
          case '/':
            return new Response('Welcome to Ralysnd configuration panel. Use /config, /subscription, or /clash.', { status: 200 });
          case `/${globalThis.AccessSubscription}`:
            return await getVVConfig();
          case `/${globalThis.AccessAdvancedConfig}`:
            return await AdvancedConfig();
          case '/clash':
            return await getClashConfig();
          case '/add-ips':
            return await addIPsToSubscription(request);
          default:
            return new Response('Not found', { status: 404 });
        }
      } else {
        return await vOWSHandler(request);
      }
    } catch (err) {
      return new Response(`Error: ${err.toString()}`, { status: 500 });
    }
  },
};

async function addIPsToSubscription(request) {
  try {
    const { ipListUrl } = await request.json();
    if (!ipListUrl) {
      return new Response(JSON.stringify({ status: 'error', message: 'IP list URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch(ipListUrl);
    if (!response.ok) {
      return new Response(JSON.stringify({ status: 'error', message: 'Failed to fetch IP list' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const text = await response.text();
    const newIPs = text.split('\n').map(ip => ip.trim()).filter(ip => ip.length > 0 && isValidIP(ip));
    globalThis.fixedIPs = [...new Set([...globalThis.fixedIPs, ...newIPs])];

    return new Response(JSON.stringify({ status: 'success', message: 'IPs added successfully', ips: globalThis.fixedIPs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

import { connect } from 'cloudflare:sockets';

async function getClashConfig() {
  const protocol = atob("dmxlc3M=");
  const dfltFp = ["chrome", "firefox", "android", "edge", "safari", "ios"];
  const fpath = globalThis.fpaths.split(',');
  var pathForSub = "%3Fed%3D2048";
  if (globalThis.GetPath) {
    globalThis.GetPath = globalThis.GetPath.replace(/=/g, '%3D');
    pathForSub = fpath[Math.floor(Math.random() * fpath.length)] + "%2F" + globalThis.GetPath + "%2F%3Fed%3D2048";
  }

  let proxies = [];
  let proxyNames = [];

  for (let thisIP of globalThis.fixedIPs) {
    for (let thisPrt of globalThis.allPorts) {
      const thisFp = dfltFp[Math.floor(Math.random() * dfltFp.length)];
      let newPathForSub = pathForSub;
      if (globalThis.GetPath) {
        newPathForSub = fpath[Math.floor(Math.random() * fpath.length)] + "%2F" + globalThis.GetPath + "%2F%3Fed%3D2048";
      }

      const proxy = {
        name: `Ralysnd-${thisPrt}-${thisIP.replace(/\./g, '-')}`,
        type: "vless",
        server: thisIP,
        port: parseInt(thisPrt),
        uuid: globalThis.UzKey,
        tls: true,
        servername: globalThis.hostName,
        "skip-cert-verify": true,
        network: "ws",
        "ws-opts": {
          path: `/${newPathForSub}`,
          headers: { Host: globalThis.hostName },
        },
        "client-fingerprint": thisFp,
        udp: true,
      };

      const isWorking = await testConfig(proxy);
      if (isWorking) {
        proxies.push(proxy);
        proxyNames.push(proxy.name);
      } else {
        console.error(`Config failed: ${proxy.name}`);
      }
    }
  }

  if (proxies.length === 0) {
    return new Response("Error: No valid Clash config generated.", { status: 500 });
  }

  const clashConfig = `
port: 7890
socks-port: 7891
allow-lan: true
mode: rule
log-level: info

proxies:
${proxies.map(p => `  - ${JSON.stringify(p)}`).join('\n')}

proxy-groups:
  - name: Proxy
    type: select
    proxies:
${proxyNames.map(name => `      - ${name}`).join('\n')}

rules:
  - GEOIP,IR,DIRECT
  - MATCH,Proxy
`;

  return new Response(clashConfig.trim(), {
    status: 200,
    headers: {
      "Content-Type": "text/yaml;charset=utf-8",
      "Content-Disposition": `attachment; filename="Ralysnd-Clash.yaml"`,
    },
  });
}

async function testConfig(proxy) {
  try {
    const testUrl = `wss://${proxy.server}:${proxy.port}/${proxy["ws-opts"].path}`;
    const ws = new WebSocket(testUrl);
    return new Promise((resolve) => {
      ws.onopen = () => {
        ws.close();
        resolve(true);
      };
      ws.onerror = () => {
        console.error(`Failed config: ${proxy.name}`);
        resolve(false);
      };
      setTimeout(() => {
        ws.close();
        resolve(false);
      }, 5000);
    });
  } catch (error) {
    console.error(`Error testing config ${proxy.name}:`, error);
    return false;
  }
}

async function getVVConfig() {
  const protocol = atob("dmxlc3M=");
  const dfltFp = ["chrome", "firefox", "android", "edge", "safari", "ios"];
  const fpath = globalThis.fpaths.split(',');
  var pathForSub = "%3Fed%3D2048";
  if (globalThis.GetPath) {
    globalThis.GetPath = globalThis.GetPath.replace(/=/g, '%3D');
    pathForSub = fpath[Math.floor(Math.random() * fpath.length)] + "%2F" + globalThis.GetPath + "%2F%3Fed%3D2048";
  }

  let vVvMain = "";
  for (let thisIP of globalThis.fixedIPs) {
    for (let thisPrt of globalThis.allPorts) {
      const thisFp = dfltFp[Math.floor(Math.random() * dfltFp.length)];
      let newPathForSub = pathForSub;
      if (globalThis.GetPath) {
        newPathForSub = fpath[Math.floor(Math.random() * fpath.length)] + "%2F" + globalThis.GetPath + "%2F%3Fed%3D2048";
      }

      vVvMain +=
        `${protocol}://${globalThis.UzKey}@${thisIP}:${thisPrt}` +
        `?encryption=none&security=tls&sni=${globalThis.hostName}&fp=${thisFp}&allowInsecure=1&alpn=h2%2Chttp%2F1.1&type=ws&host=${globalThis.hostName}&path=%2F${newPathForSub}#Ralysnd-${thisPrt}-${thisIP.replace(/\./g, '-')}\n`;
    }
  }

  vVvMain = btoa(vVvMain);

  return new Response(vVvMain, {
    status: 200,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  });
}

async function AdvancedConfig() {
  const pxipdomain = atob('Y2hpZ2FhZ28udjYubmF2eQ=='); // تغییر به chigaago.v6.navy
  const dnsdomain1 = await resolveDNS(globalThis.hostName);
  const dnsdomain2 = await resolveDNS(globalThis.CleanIPDomain);
  const dnsdomain4 = [...dnsdomain1.ipv4, ...dnsdomain2.ipv4];
  const dnsdomain6 = [...dnsdomain1.ipv6, ...dnsdomain2.ipv6];
  var TnlSecKey = "url-" + globalThis.UzKey.split('-')[0] + "/";
  var addresslist = `<datalist id='addresslist'><option value='${globalThis.hostName}'><option value='www.speedtest.net'>`;
  for (var ip4 of dnsdomain4) {
    if (ip4.slice(-1) == ".") ip4 = ip4.substr(0, ip4.length - 1);
    addresslist += `<option value='${ip4}'>`;
  }
  for (var ip6 of dnsdomain6) {
    if (ip6.slice(-1) == ".") continue;
    addresslist += `<option value='[${ip6}]'>`;
  }
  addresslist += "</datalist>";

  const AdvancedPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ralysnd Gaming Config Panel</title>
  <style>
    :root {
      --primary-color: #8b00ff;
      --secondary-color: #00ffea;
      --accent-color: #ff007a;
      --background-color: #0a0a1a;
      --container-background: #1a1a2e;
      --text-color: #e0e0ff;
      --border-color: #3a3a5a;
      --glow: 0 0 15px rgba(139, 0, 255, 0.7), 0 0 30px rgba(139, 0, 255, 0.3);
      --shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    body {
      font-family: 'Orbitron', sans-serif;
      background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
      color: var(--text-color);
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow-x: hidden;
      direction: ltr;
    }

    body.dark-mode {
      --primary-color: #a100ff;
      --secondary-color: #00ffcc;
      --background-color: #05050f;
      --container-background: #141424;
      --text-color: #f0f0ff;
      --border-color: #2a2a4a;
    }

    .container {
      background: var(--container-background);
      padding: 40px;
      border-radius: 16px;
      box-shadow: var(--shadow);
      width: 100%;
      max-width: 1200px;
      border: 2px solid var(--primary-color);
      position: relative;
      overflow: hidden;
      animation: fadeIn 1s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    h1 {
      font-size: 3rem;
      color: var(--primary-color);
      text-align: center;
      text-shadow: 0 0 10px var(--primary-color);
      margin-bottom: 40px;
      letter-spacing: 2px;
    }

    h2 {
      font-size: 2rem;
      color: var(--secondary-color);
      margin: 30px 0 15px;
      text-shadow: 0 0 8px var(--secondary-color);
    }

    .section {
      margin-bottom: 40px;
      padding: 25px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .section:hover {
      box-shadow: var(--glow);
      transform: translateY(-5px);
    }

    .line {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      align-items: center;
      margin: 20px 0;
    }

    label {
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-color);
    }

    input, select, textarea {
      padding: 12px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      color: var(--text-color);
      background: rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
      width: 100%;
    }

    input:focus, select:focus, textarea:focus {
      border-color: var(--primary-color);
      box-shadow: var(--glow);
      outline: none;
    }

    input[disabled] {
      background: rgba(255, 255, 255, 0.05);
      color: #6c757d;
    }

    textarea {
      height: 120px;
      resize: none;
    }

    button {
      padding: 14px 28px;
      font-size: 1.1rem;
      font-weight: bold;
      border: none;
      border-radius: 8px;
      background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    }

    button:hover {
      transform: translateY(-3px);
      box-shadow: var(--glow);
      background: linear-gradient(45deg, var(--accent-color), var(--primary-color));
    }

    .help {
      font-size: 0.95rem;
      color: #adb5bd;
      margin-top: 15px;
      line-height: 1.6;
    }

    .qrcode-container {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }

    .qrcode {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: var(--shadow);
    }

    .theme-toggle {
      position: fixed;
      bottom: 40px;
      right: 40px;
      background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
      color: #fff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 24px;
      cursor: pointer;
      box-shadow: var(--glow);
      transition: all 0.3s ease;
    }

    .theme-toggle:hover {
      transform: scale(1.15);
      box-shadow: 0 0 20px var(--primary-color);
    }

    .ip-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 20px;
      }
      h1 {
        font-size: 2rem;
      }
      h2 {
        font-size: 1.5rem;
      }
      .line {
        grid-template-columns: 1fr;
      }
      .theme-toggle {
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        font-size: 20px;
      }
    }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container">
    <h1>Ralysnd Gaming Config Panel</h1>

    <div class="section ip-info">
      <div>
        <span><b>Your IP:</b> <span id="clipdata">---</span></span>
        <span><b>Other:</b> <span id="otipdata">---</span></span>
      </div>
      <button type="button" id="ipbtn" onclick="GetIPs()">Get IPs</button>
    </div>

    <div class="section">
      <h2>Add IPs to Subscription</h2>
      <div class="line">
        <label>IP List URL: <input type="text" id="ipListUrl" title="URL of IP list file" placeholder="https://example.com/ips.txt" value="" /></label>
        <button type="button" id="addIpList" onclick="addIpList()">Add IPs</button>
      </div>
      <div class="help">
        <b>IP List URL Note:</b><br>
        * Enter the URL of a text file containing IP addresses (one per line).<br>
        * Example: <i>https://raw.githubusercontent.com/your-repo/ips.txt</i><br>
        * IPs will be added to your subscription configuration.
      </div>
    </div>

    <div class="section">
      <h2>Generate Configuration</h2>
      <div class="line">
        <label>Address: <input type="text" id="address" title="Config Address" placeholder="SubDomain.pages.dev" value="" onchange="chkaddress()" list="addresslist"/></label>
        ${addresslist}
        <label>Custom: <input type="checkbox" id="custom" onchange="cstm()"></label>
        <label>Host: <input type="text" id="host" title="Config Host" placeholder="" value="" disabled /></label>
        <label>SNI: <input type="text" id="sni" title="Config SNI" placeholder="" value="" disabled /></label>
      </div>
      <div class="line">
        <label>Proxy IP: <input type="text" id="pxip" title="Proxy IP" placeholder="" value="" list="pxiplist"/></label>
        <datalist id="pxiplist">
          <option value="chigaago.v6.navy">
          <option value="${atob('YnBiLnlvdXNlZi5pc2VnYXJvLmNvbQ==')}">
          <option value="${atob('cHJveHlpcC5hbWNsdWJzLmtvem93LmNvbQ==')}">
          <option value="${atob('cHJveHlpcC5meHhrLmRlZHluLmlv')}">
        </datalist>
        <span>Select IP from <a href="https://www.nslookup.io/domains/chigaago.v6.navy/dns-records/" target="_blank" style="color: var(--secondary-color);">chigaago.v6.navy</a></span>
      </div>
      <div class="help">
        <b>Proxy IP Note:</b><br>
        * Use multiple IPs separated by commas (e.g., <i>141.148.187.195,129.146.46.164</i>).<br>
        * Use a domain directly (e.g., <i>chigaago.v6.navy</i>).<br>
        * Proxy IP is used for Cloudflare servers; for other sites, a random IP is used.
      </div>
      <div class="line">
        <label>Port:
          <select id="port" title="Port">
            ${globalThis.allPorts.map(port => `<option value="${port}">${port}</option>`).join('')}
          </select>
        </label>
        <label>Fingerprint:
          <select id="fingerprint" title="Fingerprint">
            <option value="chrome" selected>Chrome</option>
            <option value="firefox">Firefox</option>
            <option value="safari">Safari</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
            <option value="edge">Edge</option>
            <option value="Randomized">Random</option>
            <option value="0">None</option>
          </select>
        </label>
      </div>
      <div class="line">
        <button type="button" id="generate" onclick="generate()">Generate Config</button>
        <button type="button" id="copy" onclick="copyToClipboard('config')">Copy Config</button>
        <button type="button" id="qrconfig" onclick="openQR('config')">QR Code</button>
        <button type="button" id="downloadClash" onclick="downloadClash()">Download Clash Config</button>
        <textarea id="config" readonly></textarea>
      </div>
      <div class="line">
        <h2>Subscription</h2>
        <div class="help">Subscription Proxy IP: <span id="subscriptionpxip">chigaago.v6.navy</span></div>
        <span id="subscriptionshow">https://${globalThis.hostName}/${globalThis.AccessSubscription}#${globalThis.CnfgName}</span>
        <input type="hidden" id="subscription" value="https://${globalThis.hostName}/${globalThis.AccessSubscription}#${globalThis.CnfgName}">
        <button type="button" id="copysub" onclick="copyToClipboard('subscription')">Copy</button>
        <button type="button" id="qrsub" onclick="openQR('subscription')">QR Code</button>
      </div>
    </div>

    <div class="section">
      <h2>Tunneling</h2>
      <div class="line">
        <label style="width: 100%;">Config: <input type="text" id="tnlconfig" title="Remote Config" placeholder="${atob('dmxlc3M=')}://..." value="" style="width: 90%"/></label>
      </div>
      <div class="help">
        <b>Tunneling Information:</b><br>
        * Supported protocols: <span style="color: var(--secondary-color)">${atob('VkxFU1M=')}</span>, <span style="color: var(--secondary-color)">${atob('Vk1FU1M=')}</span>, <span style="color: var(--secondary-color)">${atob('VHJvamFu')}</span>.<br>
        * Supported transport: Only <span style="color: var(--secondary-color)">WebSocket</span>.<br>
        * IPs are not supported; use a domain like <b>IP.sslip.io</b> instead.<br>
        * For TLS, ensure your domain has an active SSL certificate.
      </div>
      <div class="line">
        <button type="button" id="tnlcnfgenerate" onclick="tnlcnfgenerate()">Regenerate Config</button>
        <button type="button" id="tnlcnfcopy" onclick="copyToClipboard('tnlreconfig')">Copy</button>
        <button type="button" id="tnlcnfqrconfig" onclick="openQR('tnlreconfig')">QR Code</button>
        <textarea id="tnlreconfig" readonly></textarea>
        <div class="help" id="tnlhelp"></div>
      </div>
    </div>
  </div>

  <div id="qrcode-container" onclick="closeQR()"></div>
  <button id="theme-toggle" class="theme-toggle">🌙</button>

  <script>
    let defalt_address = "${globalThis.hostName}";
    let defalt_pxip = "${globalThis.CLxIP}";
    let defalt_uuid = "${globalThis.UzKey}";
    let defalt_AcsSub = "${globalThis.AccessSubscription}";
    let defalt_CnfgName = "${globalThis.CnfgName}";
    const fpathss = "${globalThis.fpaths}";
    const fpath = fpathss.split(',');
    const subpath = 'https://' + defalt_address + '/' + defalt_AcsSub + '#' + defalt_CnfgName;

    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
      document.getElementById('theme-toggle').innerHTML = '🌞';
    }

    const address = document.getElementById("address");
    const custom = document.getElementById("custom");
    const host = document.getElementById("host");
    const sni = document.getElementById("sni");
    const pxip = document.getElementById("pxip");
    const port = document.getElementById("port");
    const fingerprint = document.getElementById("fingerprint");
    const config = document.getElementById("config");
    const themeToggle = document.getElementById('theme-toggle');

    function load_defalt() {
      address.value = defalt_address;
      host.value = defalt_address;
      sni.value = defalt_address;
      pxip.value = defalt_pxip;
      GetIPs();
      themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        themeToggle.innerHTML = isDarkMode ? '🌞' : '🌙';
      });
      GetLocalStorage();
    }

    function cstm() {
      host.disabled = sni.disabled = !custom.checked;
    }

    function copyToClipboard(elementId) {
      const textToCopy = document.getElementById(elementId).value;
      navigator.clipboard.writeText(textToCopy)
        .then(() => alert('Config copied successfully!'))
        .catch(err => console.error('Error copying:', err));
    }

    function chkaddress() {
      custom.checked = address.value !== defalt_address;
      cstm();
    }

    async function addIpList() {
      const ipListUrl = document.getElementById("ipListUrl").value;
      if (!ipListUrl) {
        alert("Please enter a valid IP list URL.");
        return;
      }

      try {
        const response = await fetch('/add-ips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ipListUrl })
        });
        const result = await response.json();
        if (result.status === 'success') {
          alert("IPs added successfully to subscription!");
          generate();
        } else {
          alert("Error adding IPs: " + result.message);
        }
      } catch (error) {
        alert("Error fetching IP list: " + error.message);
      }
    }

    function generate() {
      var caddress = address.value;
      var cport = port.value;
      var cfingerprint = fingerprint.value !== "0" ? "&fp=" + fingerprint.value : "";
      var chost = custom.checked ? "&host=" + host.value : "";
      var csni = custom.checked ? "&sni=" + sni.value : "";
      var cpath = '%3Fed%3D2048';

      if (pxip.value && pxip.value !== defalt_pxip) {
        var pxipath = (btoa(pxip.value.replace(/ /g, ''))).replace(/=/g, '%3D');
        cpath = fpath[Math.floor(Math.random() * fpath.length)] + "%2F" + pxipath + "%2F%3Fed%3D2048";
        SetSub('https://' + defalt_address + '/' + defalt_AcsSub + '?path=' + pxipath + '#' + defalt_CnfgName);
        document.getElementById("subscriptionpxip").innerHTML = pxip.value;
      } else {
        SetSub(subpath);
        document.getElementById("subscriptionpxip").innerHTML = defalt_pxip + " (default)";
      }

      config.value = atob("dmxlc3M=") + "://" + defalt_uuid + "@" + caddress + ":" + cport +
        "?encryption=none&security=tls" + chost + cfingerprint + "&alpn=h2%2Chttp%2F1.1&type=ws" + csni +
        "&path=%2F" + cpath + "#Ralysnd-" + cport;
    }

    const SetSub = (suburl) => {
      if (!suburl) suburl = subpath;
      document.getElementById("subscriptionshow").innerHTML = suburl;
      document.getElementById("subscription").value = suburl;
    }

    const closeQR = () => {
      let qrcodeContainer = document.getElementById("qrcode-container");
      qrcodeContainer.style.display = "none";
      qrcodeContainer.innerHTML = "";
    }

    const openQR = (id) => {
      let url = document.getElementById(id).value;
      if (!url) return;
      let qrcodeContainer = document.getElementById("qrcode-container");
      qrcodeContainer.innerHTML = "";
      qrcodeContainer.style.display = "flex";
      let qrcodeDiv = document.createElement("div");
      qrcodeDiv.className = "qrcode";
      new QRCode(qrcodeDiv, {
        text: url,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
      qrcodeContainer.appendChild(qrcodeDiv);
    }

    function downloadClash() {
      window.location.href = '/clash';
    }

    const GetIPs = async () => {
      document.getElementById('otipdata').innerHTML = document.getElementById('clipdata').innerHTML = '---';
      try {
        const ipResponse = await fetch('https://ipwho.is/?nocache=' + Date.now(), { cache: "no-store" });
        const ipResponseObj = await ipResponse.json();
        document.getElementById('otipdata').innerHTML = ipResponseObj.ip + ' <b>' + ipResponseObj.country + ' (' + ipResponseObj.country_code + ')</b>';

        const cfIPresponse = await fetch('https://ipv4.icanhazip.com/?nocache=' + Date.now(), { cache: "no-store" });
        const cfIP = await cfIPresponse.text();
        const cfResponse = await fetch('https://ipwho.is/' + cfIP + '?nocache=' + Date.now(), { cache: "no-store" });
        const cfResponseObj = await cfResponse.json();
        document.getElementById('clipdata').innerHTML = cfIP + ' <b>' + cfResponseObj.country + ' (' + cfResponseObj.country_code + ')</b>';
      } catch (error) {
        document.getElementById('otipdata').innerHTML = 'Error fetching IP information';
      }
    }

    var defalt_tnlsec = "${TnlSecKey}";
    var tnlconfig = document.getElementById("tnlconfig");
    var tnlreconfig = document.getElementById("tnlreconfig");
    var tnlhelp = document.getElementById("tnlhelp");
    var tnlPreName = "Ralysnd-Tnl-";

    async function tnlcnfgenerate() {
      let VlConfig = {};
      let TnlError = {};
      var ConfigMode;

      if (!tnlconfig.value) return;
      if (tnlconfig.value.startsWith("${atob('dmxlc3M=')}") || tnlconfig.value.startsWith("${atob('dHJvamFu')}")) {
        VlConfig = GetVlConfig(tnlconfig.value);
        ConfigMode = "vl";
      } else if (tnlconfig.value.startsWith("${atob('dm1lc3M=')}")) {
        VlConfig = GetVmConfig(tnlconfig.value);
        ConfigMode = "vm";
      } else {
        alert("⚠️ Supported protocols: ${atob('VkxFU1M=')}, ${atob('Vk1FU1M=')}, and ${atob('VHJvamFu')}.");
      }

      VlConfig.base.sni = VlConfig.base.sni ? VlConfig.base.sni.toLowerCase() : "";
      VlConfig.base.host = VlConfig.base.host ? VlConfig.base.sni.toLowerCase() : "";

      if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(VlConfig.base.address)) {
        VlConfig.base.address = VlConfig.base.address + atob("LnNzbGlwLmlv");
        TnlError.address_is_ip = true;
      } else {
        if (VlConfig.base.sni && (VlConfig.base.address !== VlConfig.base.sni)) {
          TnlError.address_not_sni = true;
        }
      }

      var new_path_http = "http";
      if (VlConfig.base.security) {
        if (VlConfig.base.security == "tls") {
          new_path_http = "https";
          TnlError.security_is_tls = true;
        }
      }
      var new_path_path = VlConfig.base.path ? VlConfig.base.path : "/";
      VlConfig.base.path = "/" + defalt_tnlsec + btoa(new_path_http + "://" + VlConfig.base.address + ":" + VlConfig.base.port + new_path_path);
      if (TnlError.security_is_tls && (TnlError.address_is_ip || TnlError.address_not_sni)) {
        var new_path_sni = "/" + defalt_tnlsec + btoa(new_path_http + "://" + VlConfig.base.sni + ":" + VlConfig.base.port + new_path_path);
      }
      if (VlConfig.base.type !== "ws") {
        TnlError.type_not_ws = true;
      }

      var active_address = VlConfig.base.sni || VlConfig.base.host || VlConfig.base.address;
      if (active_address == defalt_address || active_address.includes(defalt_address)) {
        TnlError.config_is_self = true;
      }
      if (new_path_path.includes(defalt_tnlsec)) {
        TnlError.config_is_selftnl = true;
      }
      if (active_address.includes("pages.dev") || active_address.includes("workers.dev")) {
        TnlError.config_is_worker = true;
      }

      var TnlIsGood = SetTnlNotice(TnlError, VlConfig);
      if (!TnlIsGood) return;

      var NewTnlConfig;
      tnlreconfig.value = "";
      if ((TnlError.address_is_ip && !VlConfig.base.sni) || (!TnlError.address_is_ip)) {
        tnlreconfig.value += SetConfig(ConfigMode, VlConfig) + "\\n";
      }
      if (new_path_sni) {
        VlConfig.base.path = new_path_sni;
        tnlreconfig.value += SetConfig(ConfigMode, VlConfig) + "\\n";
      }

      localStorage.setItem(tnlconfig.id, tnlconfig.value);
    }

    function SetConfig(ConfigMode, VlConfig) {
      if (ConfigMode == "vl") {
        return SetVlConfig(VlConfig);
      } else if (ConfigMode == "vm") {
        return SetVmConfig(VlConfig);
      }
    }

    function SetTnlNotice(TnlError, VlConfig) {
      var NewError = "";
      if (TnlError.config_is_selftnl) {
        alert("⚠️ Do not use tunneling within itself!");
        return false;
      }
      if (TnlError.config_is_self) {
        alert("⚠️ Do not use my own config for tunneling!");
        return false;
      }

      tnlhelp.innerHTML = "<h3>Warning:</h3>";
      if (TnlError.type_not_ws) {
        tnlhelp.innerHTML += "⚠️ <b>Config transport is not WebSocket</b>, tunneling may not work.<br/>";
      }
      if (VlConfig.base.security == "reality") {
        tnlhelp.innerHTML += "⚠️ <b>Config security is reality</b>, tunneling may not work.<br/>";
      }
      if (TnlError.address_is_ip) {
        if (TnlError.security_is_tls && VlConfig.base.sni) {
          tnlhelp.innerHTML += "⚠️ <b>Config address is an IP</b>, using SNI (<a href='http://" + VlConfig.base.sni + "' target='_blank'>" + VlConfig.base.sni + "</a>) as config address.<br/>";
        } else {
          tnlhelp.innerHTML += "⚠️ <b>Config address is an IP</b>, using <a href='http://" + VlConfig.base.address + "' target='_blank'>" + VlConfig.base.address + "</a>) as domain substitute.<br/>";
          if (TnlError.security_is_tls) {
            tnlhelp.innerHTML += "⚠️ <b>Config uses TLS</b>, obtain an active SSL certificate for " + VlConfig.base.address + ".<br/>";
          }
        }
      } else {
        if (TnlError.security_is_tls && TnlError.address_not_sni) {
          tnlhelp.innerHTML += "⚠️ <b>Config SNI differs from address</b>, generated two tunneling configs: one with address (" + VlConfig.base.address + ") and one with SNI (" + VlConfig.base.sni + ").<br/>";
        }
      }
      if (TnlError.config_is_worker) {
        tnlhelp.innerHTML += "⚠️ <b>Using CL-Worker configs is not recommended</b>.<br/>";
      }

      tnlhelp.innerHTML += "<span style='color: var(--secondary-color)'>Tunneling config generated successfully.</span>";
      return true;
    }

    function SetVmConfig(SetConfig) {
      var NewConfig;
      SetConfig.data.path = SetConfig.base.path;
      SetConfig.data.sni = SetConfig.data.host = defalt_address;
      SetConfig.data.port = "443";
      SetConfig.data.ps = unescape(encodeURIComponent(tnlPreName)) + SetConfig.base.name;
      if (SetConfig.data.security !== "tls") {
        SetConfig.data.tls = "tls";
        SetConfig.data.fp = "chrome";
        SetConfig.data.alpn = "http/1.1";
      }
      NewConfig = SetConfig.base.protocol + "://" + btoa(JSON.stringify(SetConfig.data));
      return NewConfig;
    }

    function SetVlConfig(SetConfig) {
      var NewConfig;
      var NewDataConfig = "";
      SetConfig.data.path = SetConfig.base.path;
      SetConfig.data.sni = SetConfig.data.host = defalt_address;
      if (SetConfig.data.security !== "tls") {
        SetConfig.data.allowInsecure = "1";
        SetConfig.data.fp = "chrome";
        SetConfig.data.alpn = "http/1.1";
      }
      SetConfig.data.security = "tls";

      Object.keys(SetConfig.data).forEach(key => {
        NewDataConfig += key + "=" + encodeURIComponent(SetConfig.data[key]) + "&";
      });
      NewDataConfig = NewDataConfig.substr(0, NewDataConfig.length - 1);

      NewConfig = SetConfig.base.protocol + "://" + SetConfig.base.id + "@" + defalt_address + ":443?" + NewDataConfig + "#Ralysnd-" + SetConfig.base.port;
      return NewConfig;
    }

    function GetVmConfig(getconfig) {
      let setconfig = {};
      if (!getconfig.startsWith("${atob('dm1lc3M=')}://")) return false;
      getconfig = getconfig.replaceAll("${atob('dm1lc3M=')}://", "");
      getconfig = atob(getconfig);

      let setdata = JSON.parse(getconfig);
      setconfig.protocol = "${atob('dm1lc3M=')}";
      setconfig.address = setdata.add;
      setconfig.security = setdata.tls ? setdata.tls : null;
      setconfig.name = setdata.ps ? setdata.ps : null;
      setconfig.type = setdata.net ? setdata.net : null;

      return { "base": { ...setdata, ...setconfig }, "data": setdata };
    }

    function GetVlConfig(getconfig) {
      let setconfig = {};
      setconfig.name = getconfig.includes("#") ? decodeURIComponent(getconfig.match(/#([^#]*)/)[1]) : null;
      setconfig.protocol = getconfig.match(/(.*?):\\/\\//)[1];
      setconfig.id = getconfig.match(/\\:\\/\\/(.*?)\\@/)[1];
      setconfig.address = getconfig.match(/@([a-z0-9.-]{2,}):/)[1];
      setconfig.port = getconfig.match(/:([0-9]{2,})\\?/)[1];

      if (!getconfig.includes("#")) getconfig += "#";
      if (getconfig.includes("%22")) getconfig = getconfig.replaceAll("%22", "%27");
      let setdata = JSON.parse(decodeURIComponent('{"' + getconfig.replaceAll('&', '","').replaceAll('=', '":"').match(/\\?(.*?)#/)[1] + '"}'));

      return { "base": { ...setconfig, ...setdata }, "data": setdata };
    }

    function GetLocalStorage() {
      if (localStorage.length > 0) {
        Object.keys(localStorage).forEach(key => {
          if (document.getElementById(key))
            document.getElementById(key).value = localStorage.getItem(key);
        });
      }
    }

    load_defalt();
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</body>
</html>`;

  return new Response(AdvancedPage, {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, no-transform",
      "CDN-Cache-Control": "no-store"
    }
  });
}

async function vOWSHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);

  webSocket.accept();

  let address = '';
  let portWithRandomLog = '';
  const log = (info, event) => {
    console.log(`[${address}:${portWithRandomLog}] ${info}`, event || '');
  };
  const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';

  const readableWebSocketStream = mkRdWSktStrm(webSocket, earlyDataHeader, log);
  let remoteSocketWapper = { value: null };
  let udpStreamWrite = null;
  let isDns = false;

  readableWebSocketStream.pipeTo(new WritableStream({
    async write(chunk, controller) {
      if (isDns && udpStreamWrite) {
        return udpStreamWrite(chunk);
      }
      if (remoteSocketWapper.value) {
        const writer = remoteSocketWapper.value.writable.getWriter();
        await writer.write(chunk);
        writer.releaseLock();
        return;
      }

      const { hasError, message, portRemote = 443, addressRemote = '', rawDataIndex, vVvVersion = new Uint8Array([0, 0]), isUDP } = prssVvHeader(chunk, globalThis.UzKey);
      address = addressRemote;
      portWithRandomLog = `${portRemote}--${Math.random()} ${isUDP ? 'udp ' : 'tcp '}`;
      if (hasError) {
        throw new Error(message);
        return;
      }
      if (isUDP) {
        if (portRemote === 53) {
          isDns = true;
        } else {
          throw new Error('UDP is only enabled for DNS (port 53)');
        }
      }
      const vvResponseHeader = new Uint8Array([vVvVersion[0], 0]);
      const rawClientData = chunk.slice(rawDataIndex);

      if (isDns) {
        const { write } = await hUOBnd(webSocket, vvResponseHeader, log);
        udpStreamWrite = write;
        udpStreamWrite(rawClientData);
        return;
      }
      hTOBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, vvResponseHeader, log);
    },
    close() {},
    abort(reason) {},
  })).catch((err) => {});

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

async function hTOBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, vvResponseHeader, log) {
  async function connectAndWrite(address, port) {
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address))
      address = `${atob("d3d3Lg==")}${address}${atob("LnNzbGlwLmlv")}`;
    const tcpSocket = connect({ hostname: address, port });
    remoteSocket.value = tcpSocket;
    const writer = tcpSocket.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();
    return tcpSocket;
  }

  async function retry() {
    const pnlPxIP = globalThis.pathName.split("/")[2];
    const pnlPxIPs = pnlPxIP ? atob(pnlPxIP).split(",") : void 0;
    const rmtPyIP = pnlPxIPs ? pnlPxIPs[Math.floor(Math.random() * pnlPxIPs.length)] : globalThis.CLxIP || addressRemote;

    const tcpSocket = await connectAndWrite(rmtPyIP, portRemote);
    tcpSocket.closed.catch(error => {}).finally(() => {
      safeCloseWebSocket(webSocket);
    });
    rmtSkt2WS(tcpSocket, webSocket, vvResponseHeader, null, log);
  }

  const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  rmtSkt2WS(tcpSocket, webSocket, vvResponseHeader, retry, log);
}

function mkRdWSktStrm(webSocketServer, earlyDataHeader, log) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocketServer.addEventListener('message', (event) => {
        if (readableStreamCancel) return;
        const message = event.data;
        controller.enqueue(message);
      });

      webSocketServer.addEventListener('close', () => {
        safeCloseWebSocket(webSocketServer);
        if (readableStreamCancel) return;
        controller.close();
      });

      webSocketServer.addEventListener('error', (err) => {
        controller.error(err);
      });

      const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
      if (error) {
        controller.error(error);
      } else if (earlyData) {
        controller.enqueue(earlyData);
      }
    },
    pull(controller) {},
    cancel(reason) {
      readableStreamCancel = true;
      safeCloseWebSocket(webSocketServer);
    }
  });

  return stream;
}

function prssVvHeader(vVvBuffer, UrKey) {
  if (vVvBuffer.byteLength < 24) {
    return { hasError: true, message: 'Invalid data' };
  }
  const version = new Uint8Array(vVvBuffer.slice(0, 1));
  let isValidUser = false;
  let isUDP = false;
  if (stringify(new Uint8Array(vVvBuffer.slice(1, 17))) === UrKey) {
    isValidUser = true;
  }
  if (!isValidUser) {
    return { hasError: true, message: 'Invalid user' };
  }

  const optLength = new Uint8Array(vVvBuffer.slice(17, 18))[0];
  const command = new Uint8Array(vVvBuffer.slice(18 + optLength, 18 + optLength + 1))[0];

  if (command === 1) {
  } else if (command === 2) {
    isUDP = true;
  } else {
    return { hasError: true, message: `Command ${command} is not supported, commands: 01-tcp, 02-udp, 03-mux` };
  }
  const portIndex = 18 + optLength + 1;
  const portBuffer = vVvBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);

  let addressIndex = portIndex + 2;
  const addressBuffer = new Uint8Array(vVvBuffer.slice(addressIndex, addressIndex + 1));
  const addressType = addressBuffer[0];
  let addressLength = 0;
  let addressValueIndex = addressIndex + 1;
  let addressValue = '';
  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(vVvBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join('.');
      break;
    case 2:
      addressLength = new Uint8Array(vVvBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(vVvBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 3:
      addressLength = 16;
      const dataView = new DataView(vVvBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(':');
      break;
    default:
      return { hasError: true, message: `Invalid address type ${addressType}` };
  }
  if (!addressValue) {
    return { hasError: true, message: `Address is empty, address type ${addressType}` };
  }

  return {
    hasError: false,
    addressRemote: addressValue,
    addressType,
    portRemote,
    rawDataIndex: addressValueIndex + addressLength,
    vVvVersion: version,
    isUDP,
  };
}

async function rmtSkt2WS(remoteSocket, webSocket, vvResponseHeader, retry, log) {
  let remoteChunkCount = 0;
  let chunks = [];
  let vVvHeader = vvResponseHeader;
  let hasIncomingData = false;
  await remoteSocket.readable.pipeTo(new WritableStream({
    start() {},
    async write(chunk, controller) {
      hasIncomingData = true;
      if (webSocket.readyState !== WS_READY_STATE_OPEN) {
        controller.error('webSocket.readyState is not open, probably closed');
      }
      if (vVvHeader) {
        webSocket.send(await new Blob([vVvHeader, chunk]).arrayBuffer());
        vVvHeader = null;
      } else {
        webSocket.send(chunk);
      }
    },
    close() {},
    abort(reason) {
      console.error(`rmtConct!.redbl X`, reason);
    },
  })).catch((error) => {
    console.error(`rmtSkt2WS has error`, error.stack || error);
    safeCloseWebSocket(webSocket);
  });

  if (hasIncomingData === false && retry) {
    retry();
  }
}

function base64ToArrayBuffer(base64Str) {
  if (!base64Str) {
    return { error: null };
  }
  try {
    base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    const decode = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { error };
  }
}

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;

function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
      socket.close();
    }
  } catch (error) {
    console.error('Error closing WebSocket', error);
  }
}

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" +
    byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" +
    byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" +
    byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" +
    byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset);
  if (!isValidUUID(uuid)) {
    throw TypeError("Generated UUID is invalid");
  }
  return uuid;
}

async function hUOBnd(webSocket, vvResponseHeader, log) {
  let isvVvHeaderSent = false;
  const transformStream = new TransformStream({
    start(controller) {},
    transform(chunk, controller) {
      for (let index = 0; index < chunk.byteLength;) {
        const lengthBuffer = chunk.slice(index, index + 2);
        const udpPakcetLength = new DataView(lengthBuffer).getUint16(0);
        const udpData = new Uint8Array(chunk.slice(index + 2, index + 2 + udpPakcetLength));
        index = index + 2 + udpPakcetLength;
        controller.enqueue(udpData);
      }
    },
    flush(controller) {}
  });

  transformStream.readable.pipeTo(new WritableStream({
    async write(chunk) {
      const resp = await fetch('https://1.1.1.1/dns-query', {
        method: 'POST',
        headers: { 'content-type': 'application/dns-message' },
        body: chunk,
      });
      const dnsQueryResult = await resp.arrayBuffer();
      const udpSize = dnsQueryResult.byteLength;
      const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
      if (webSocket.readyState === WS_READY_STATE_OPEN) {
        if (isvVvHeaderSent) {
          webSocket.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
        } else {
          webSocket.send(await new Blob([vvResponseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
          isvVvHeaderSent = true;
        }
      }
    }
  })).catch((error) => {});

  const writer = transformStream.writable.getWriter();
  return { write(chunk) { writer.write(chunk); } };
}

async function hTnlReq(request, targetUrl) {
  const url = new URL(request.url);
  if (targetUrl.startsWith("aHR0")) {
    targetUrl = atob(targetUrl);
  }
  try {
    new URL(targetUrl);
  } catch (e) {
    return new Response('Invalid URL address.', { status: 400 });
  }

  const modifiedRequest = new Request(targetUrl + url.search, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: request.redirect,
    credentials: request.credentials,
  });
  return await fetch(modifiedRequest);
}

async function resolveDNS(domain) {
  const dohURL2 = "https://cloudflare-dns.com/dns-query";
  const dohURLv4 = `${dohURL2}?name=${encodeURIComponent(domain)}&type=A`;
  const dohURLv6 = `${dohURL2}?name=${encodeURIComponent(domain)}&type=AAAA`;
  try {
    const [ipv4Response, ipv6Response] = await Promise.all([
      fetch(dohURLv4, { headers: { accept: "application/dns-json" } }),
      fetch(dohURLv6, { headers: { accept: "application/dns-json" } })
    ]);
    const ipv4Addresses = await ipv4Response.json();
    const ipv6Addresses = await ipv6Response.json();
    const ipv4 = ipv4Addresses.Answer ? ipv4Addresses.Answer.map((record) => record.data) : [];
    const ipv6 = ipv6Addresses.Answer ? ipv6Addresses.Answer.map((record) => record.data) : [];
    return { ipv4, ipv6 };
  } catch (error) {
    console.error("Error resolving DNS:", error);
    throw new Error(`DNS resolution error - ${error}`);
  }
}
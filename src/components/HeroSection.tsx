import heroBg from "@/assets/hero-bg.jpeg";

const HeroSection = () => (
  <div className="relative h-48 flex items-center justify-center flex-col text-center overflow-hidden">
    <img src={heroBg} alt="Barbearia Barbosa" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
    <div className="relative z-10">
      <h1 className="text-3xl font-black text-gold tracking-tight">💈 Barbearia Barbosa</h1>
      <p className="text-muted-foreground mt-1">Failed to load resource: net::ERR_FILE_NOT_FOUND
app-shared-OqDivx4B.js:3 [perf] mark editor:nav-start @ 20949.8ms
app-shared-OqDivx4B.js:5 Initializing RudderStack Analytics
esm-CfGGBcFO.js:4  RS SDK  DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Facebook Pixel" - A timeout of 10000 ms occurred while trying to load the script with id "Facebook-Pixel___31beY28FWhkoFVcaRnPRHjZgoHc" from URL "https://rs.lovable.dev/3.24.2/modern/js-integrations/FacebookPixel.min.js"
outputLog @ esm-CfGGBcFO.js:4
esm-CfGGBcFO.js:4  RS SDK  DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "TikTok Ads" - A timeout of 10000 ms occurred while trying to load the script with id "TikTok-Ads___31loXbqf4atto8QT0rytecIuyjD" from URL "https://rs.lovable.dev/3.24.2/modern/js-integrations/TiktokAds.min.js"
outputLog @ esm-CfGGBcFO.js:4
esm-CfGGBcFO.js:4  RS SDK  DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Google Ads" - A timeout of 10000 ms occurred while trying to load the script with id "Google-Ads___32YgnplxHljwTfNugqDSYkIJ2Af" from URL "https://rs.lovable.dev/3.24.2/modern/js-integrations/GoogleAds.min.js"
outputLog @ esm-CfGGBcFO.js:4
esm-CfGGBcFO.js:4  RS SDK  DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Google Analytics 4 (GA4)" - A timeout of 10000 ms occurred while trying to load the script with id "Google-Analytics-4-(GA4)___32YjYP1mCxsEfzMEI0TnoWD5Q4n" from URL "https://rs.lovable.dev/3.24.2/modern/js-integrations/GA4.min.js"
outputLog @ esm-CfGGBcFO.js:4
esm-CfGGBcFO.js:4  RS SDK  DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Bing Ads" - A timeout of 10000 ms occurred while trying to load the script with id "Bing-Ads___345DclO7yw5xFnS1QXmAlYz7DGE" from URL "https://rs.lovable.dev/3.24.2/modern/js-integrations/BingAds.min.js"
outputLog @ esm-CfGGBcFO.js:4
esm-CfGGBcFO.js:4  RS SDK  DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Linkedin Insight Tag" - A timeout of 10000 ms occurred while trying to load the script with id "Linkedin-Insight-Tag___39o4JWLnLBbPkNBRIpS9AHMmTgk" from URL "https://rs.lovable.dev/3.24.2/modern/js-integrations/LinkedInInsightTag.min.js"
outputLog @ esm-CfGGBcFO.js:4
esm-CfGGBcFO.js:4  RS SDK  DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "HubSpot" - A timeout of 10000 ms occurred while trying to load the script with id "HubSpot___3A6qn3ZT7oKBDeyO7dI9WRVRro7" from URL "https://rs.lovable.dev/3.24.2/modern/js-integrations/HubSpot.min.js"
outputLog @ esm-CfGGBcFO.js:4
esm-CfGGBcFO.js:4  RS SDK  DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "DCM Floodlight" - A timeout of 10000 ms occurred while trying to load the script with id "DCM-Floodlight___3FDDKmfdkqSldA3JJp8vq9WThDM" from URL "https://rs.lovable.dev/3.24.2/modern/js-integrations/DCMFloodlight.min.js"
outputLog @ esm-CfGGBcFO.js:4
esm-CfGGBcFO.js:4  RS SDK  DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Reddit Pixel" - A timeout of 10000 ms occurred while trying to load the script with id "Reddit-Pixel___3HJH0fJ5cv5dDfwgk1fYNjJfMY4" from URL "https://rs.lovable.dev/3.24.2/modern/js-integrations/RedditPixel.min.js"
outputLog @ esm-CfGGBcFO.js:4
564f4546-d9c4-4eda-8799-15fc50dc83a3:1 Access to fetch at 'https://www.vaultxx.shop/api/extension/version' from origin 'https://lovable.dev' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
www.vaultxx.shop/api/extension/version:1  Failed to load resource: net::ERR_FAILED
65The resource &lt;URL&gt; was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
vendor-sentry-O5rzwS8b.js:15 [perf] mark editor:shell-rendered @ 86080.1ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:trunk:to-shell-rendered: 65130.4ms
vendor-sentry-O5rzwS8b.js:15 [perf] mark editor:desktop-content-mounted @ 86787.1ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:trunk:to-desktop-content: 65837.5ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:chat:nav-to-ws-connect: 65847.4ms
vendor-sentry-O5rzwS8b.js:15 [perf] mark editor:permissions-resolved @ 86812.4ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:trunk:to-permissions-resolved: 65862.8ms
vendor-react-DhRxAFgR.js:8 Unrecognized feature: 'vr'.
On @ vendor-react-DhRxAFgR.js:8
vendor-react-DhRxAFgR.js:8 Unrecognized feature: 'ambient-light-sensor'.
On @ vendor-react-DhRxAFgR.js:8
vendor-react-DhRxAFgR.js:8 Unrecognized feature: 'battery'.
On @ vendor-react-DhRxAFgR.js:8
5An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing.
vendor-sentry-O5rzwS8b.js:15 [perf] mark editor:project-data-first @ 87782.4ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:project:nav-to-data: 66832.7ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:chat:nav-to-interactive: 67444.8ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:chat:nav-to-initial-data: 69548.4ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:chat:fetch-to-data: 3701.8ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:chat:fetch-to-response: 3698.2ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:chat:response-to-data: 3.6ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:chat:nav-to-first-history: 69967.6ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:chat:ws-to-first-data: 4120.2ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:chat:nav-to-visible: 72656.7ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:chat:data-to-visible: 2689.1ms
vendor-sentry-O5rzwS8b.js:15 [perf] measure editor:preview:nav-to-visible: 74091.5ms
lovable.js:92 ❤️ Lovable Script — v1.7.0
client:1  Failed to load resource: the server responded with a status of 404 () ARRUME ESSES ERROS</p>
    </div>
  </div>
);

export default HeroSection;

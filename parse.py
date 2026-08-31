import json, re

with open('C:/Users/moham/.gemini/antigravity/brain/79627386-fa19-4f27-8433-17ed14db3a12/.system_generated/steps/145/content.md', 'r', encoding='utf-8') as f:
    html = f.read()

match = re.search(r'data-page="([^"]+)"', html)
if match:
    data_page = match.group(1).replace('&quot;', '"')
    try:
        data = json.loads(data_page)
        print("Props keys:", data['props'].keys())
        # Print stringified props but only up to 2000 chars to avoid overwhelming
        # Actually, Inertia props don't contain the static text! Static text is in the JS bundles!
    except Exception as e:
        print("JSON parse error:", e)

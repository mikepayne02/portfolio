---
title: 'Grafana iOS Widgets'
description: 'iOS Home screen widgets for Grafana using Scriptable'
publishDate: '1 May 2024'
tags: ['Docker', 'Typescript']
---

Graphs are generated server-side with [grafana-iamge-renderer](https://github.com/grafana/grafana-image-renderer). The script fetches the image and displays it on the widget. All home screen, lock screen, and apple watch widget types are supported.

## Server Setup

1. Install [docker](https://docs.docker.com/engine/install/)
2. Download docker-compose.yaml and place it in a folder

```bash
$ mkdir grafana && cd grafana && wget https://raw.githubusercontent.com/michaelpayne02/grafana-ios-widget/main/docker-compose.yaml
```

4. Bring up Grafana stack

```
$ docker compose up -d
```

### Grafana setup

1. Create a [service account](https://grafana.com/docs/grafana/latest/administration/service-accounts/) in your Grafana instance.
2. Create a dashboard to hold the panels or use an existing one. For best results, turn on `Transparent background` under Panel Options. Delete the title as well because it's provided via the script using your system font.
3. Click the `share` icon in the top right corner. You will be presented with a url directly linking to the chosen panel. Use this information to update the configuration variables at the top of the script.

### Device Setup

1. Download [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188?uo=4)
2. Download and save the Script to your iCloud Drive under the Scriptable folder. If it does not exist, you may need to create a script and save it. Copying the script into the editor works fine as well.
3. Add a widget to your home screen or lock screen, and select the script "Grafana."
4. Fill in the `Parameter` field using this format:

```
< widget type: sm|med|lg|rect|circ>,<panelId>,<title>,<title alignment: l|c|r>
```

The default config is `med,1,Grafana,c` 5. Find your corresponding device resolution on [Apple Developer Docs](https://developer.apple.com/design/human-interface-guidelines/widgets#Specifications). For most retina devices, device the pixel dimensions by 3 to get pts. Forolder, non-retina devices, divide by 2.

### Dark/light mode

Unfortunately, Scriptable widgets do not support automatic dark/light mode switching outside of the native widget background and text colors. To change the color scheme, edit the `darkMode` variable in the configuration section of the script. Set it to `true` for dark mode and `false` for light mode.

import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const VIRTUAL_ID = 'virtual:test-user-app'
const RESOLVED_VIRTUAL_ID = VIRTUAL_ID + '.svelte'

const SANDBOX_VIRTUAL_ID = 'virtual:sandbox-user-app'
const SANDBOX_RESOLVED_VIRTUAL_ID = SANDBOX_VIRTUAL_ID + '.svelte'

const SCRIPT_CLOSE = "</scr" + "ipt>"

function injectPreludeIntoSfc(source: string, prelude: string) {
  const match = source.match(/<script\b[^>]*>/i)
  if (!match || match.index == null) {
    return `<script lang="ts">\n${prelude}\n${SCRIPT_CLOSE}\n\n${source}`
  }

  const insertAt = match.index + match[0].length
  return source.slice(0, insertAt) + `\n${prelude}\n` + source.slice(insertAt)
}

const sandboxPrelude = `import { Accordion, AccordionItem, Button, SelectButton, CopyButton, ExpandButton, ColorSchemeButton, ThemeButton, StyleButton, ButtonGroup, OverflowActions, OverflowAction, Breadcrumb, Card, ScrollArea, Indicator, Pagination, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, resizable, Separator, Progress, Slider, Input, SearchInput, Textarea, Select, Listbox, MenuItem, Frame, LocaleProvider, IconProvider, Text, Tooltip, Badge, Chip, Link, Tag, Kbd, CodeBlock, Popover, showPopover, hidePopover, togglePopover, Dialog, showDialog, hideDialog, Avatar, AvatarGroup, Gradient, SnowUILogo, Icon, Skeleton, Spinner, Radio, Checkbox, Switch, Image, ImageGroup } from "/src/index";
import SnowUILogoHoverController from "/src/test/SnowUILogoHoverController.svelte";
import { Field, FlowText, NumberFlow, NumericText, ScrambleText, SlotText, GradientMotion, ImageViewer, SidePanel, Sidebar, SidebarSection, SidebarItem, SearchBox, CircularChart, GaugeChart, ChartGroup, LineChart, BarChart, Tab, Segmented, Toast, Toaster, DataTable, toast, dismissToast, dismissAllToasts, FramePro, initMotion, getMotion } from "@snowui-design-system/components-pro";
import { fade, fly, slide } from "svelte/transition";

import * as Resource from "@snowui-design-system/resource-svelte";
import {
  Icon as ResourceIcon,
  createSnowUIComponentIconResolver,
  FourLeafClover,
  Heart,
  Check,
  SnowLogo,
  WinkingFace,
  Image01,
  Gradient01,
  CursorsDefault,
  Illustration01,
  Dot,
  DotCircle,
  Bell,
  ArrowLineUp,
  ArrowLineUpDown,
  ArrowLineDown,
  ArrowLineLeft,
  ArrowLineRight,
  ArrowUpRight,
  Close,
  CalendarBlank,
  CreditCard,
  Paperclip,
  PaperPlaneRight,
  Star,
  Github,
  Plus,
  Minus,
  Clock,
  XCircle,
  AvatarByewind,
} from "@snowui-design-system/resource-svelte";`

const testPrelude = sandboxPrelude

let testUserSource = `<script lang="ts">
  import { Text } from "/src/index";
${SCRIPT_CLOSE}

<div style="padding: 2rem;">
  <Text lines={1} class="size-80 border-red">这是一段很长很长的文字，截断时会自动显示 Tooltip 提示全文。</Text>
</div>
`

let testUserCode = `<div style="padding: 2rem;">
  <Text lines={1} class="size-80 border-red">这是一段很长很长的文字，截断时会自动显示 Tooltip 提示全文。</Text>
</div>
`

testUserSource = injectPreludeIntoSfc(testUserCode, testPrelude)

let sandboxUserSource = `<script lang="ts">
  import { Text } from "/src/index";
${SCRIPT_CLOSE}

<div style="padding: 2rem;">
  <Text lines={1} class="size-80 border-red">在右侧输入任意 Svelte 组件源码（SFC），左侧会实时预览。</Text>
</div>
`

let sandboxUserCode = `<div style="padding: 2rem;">
  <Text lines={1} class="size-80 border-red">在右侧输入任意 Svelte 组件源码（SFC），左侧会实时预览。</Text>
</div>
`

sandboxUserSource = injectPreludeIntoSfc(sandboxUserCode, sandboxPrelude)


import fs from 'node:fs';
import path from 'node:path';

function updateExampleInFile(filePath: string, exampleName: string, newCode: string, isNew: boolean) {
  if (!fs.existsSync(filePath)) return false;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Normalize new code indentation (assume 8 spaces for code block content)
  // But since we are replacing the whole string in the array, we just need to be careful about escaping.
  // Actually, the `code` property in the file is usually a template literal or string.
  // The current format in Button.test.ts uses backticks.

  if (isNew) {
    // Append new example to the array
    // Find the end of the array
    const closingBracketIndex = content.lastIndexOf('] as const;');
    if (closingBracketIndex === -1) return false;

    const newExampleString = `
    {
        name: "${exampleName}",
        code: \`${newCode.replace(/`/g, '\\`')}\`,
        logic: ["UserCreated"],
    },`;

    content = content.slice(0, closingBracketIndex) + newExampleString + content.slice(closingBracketIndex);
  } else {
    // Update existing example
    // We look for `name: "Example Name",` and then the `code:` property following it.
    // This regex tries to match the specific example block.
    // It assumes the structure: name: "...", code: `...`,

    // Escape special regex characters in exampleName
    const escapedName = exampleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Regex explanation:
    // name:\s*"${escapedName}"  -> match name property
    // [\s\S]*?                  -> match anything (non-greedy) until code property
    // code:\s*`                 -> match code property start
    // ([\s\S]*?)                -> capture current code content (non-greedy)
    // `,                        -> match code property end
    const regex = new RegExp(`(name:\\s*"${escapedName}"[\\s\\S]*?code:\\s*\`)([\\s\\S]*?)(\`,)`, 'g');

    if (!regex.test(content)) {
      console.error(`Example "${exampleName}" not found in ${filePath}`);
      return false;
    }

    content = content.replace(regex, (match, prefix, oldCode, suffix) => {
      return `${prefix}${newCode.replace(/`/g, '\\`')}${suffix}`;
    });
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

function deleteExampleInFile(filePath: string, exampleName: string) {
  if (!fs.existsSync(filePath)) return false;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Escape special regex characters in exampleName
  const escapedName = exampleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Regex to match the example object in the array
  // It matches:
  // 1. Optional comma and whitespace before the object
  // 2. The object start `{`
  // 3. The name property
  // 4. The rest of the object content until `},` or `}`
  // This is a bit tricky with regex. A safer bet given the structure is to match the block.

  // We assume the standard format generated by us or existing in the file:
  // {
  //    name: "Name",
  //    ...
  // },

  // Let's try to match from `{` containing the name, to the closing `},` or `}`
  // We can use the same strategy as update: find the name, then expand outwards.

  // Actually, since we are in a list, we want to remove the whole `{ ... },` block.
  // Let's try to match:
  // \s*\{\s*name:\s*"${escapedName}"[\s\S]*?\}(,|)\s*

  const regex = new RegExp(`\\s*\\{\\s*name:\\s*"${escapedName}"[\\s\\S]*?\\}(,|)\\s*`, 'g');

  if (!regex.test(content)) {
    return false;
  }

  content = content.replace(regex, '');

  // Clean up potential double commas or trailing commas if we messed up, 
  // but the regex above includes the trailing comma `(,|)`.
  // However, if it was the last item, we might leave a trailing comma in the array `[ ..., ]` which is valid in JS/TS.

  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

export default defineConfig({
  resolve: {
    alias: {
      '@snowui-design-system/resource-svelte': path.resolve(__dirname, '../resource-svelte/src/index.ts'),
      '@snowui-design-system/components-pro': path.resolve(__dirname, '../pro/src/index.ts'),
    }
  },
  plugins: [
    svelte(),
    {
      name: 'test-user-source',
      resolveId(id) {
        if (id === VIRTUAL_ID || id.startsWith(VIRTUAL_ID + '?')) return RESOLVED_VIRTUAL_ID
        if (id === SANDBOX_VIRTUAL_ID || id.startsWith(SANDBOX_VIRTUAL_ID + '?')) return SANDBOX_RESOLVED_VIRTUAL_ID
        return null
      },
      load(id) {
        if (id === RESOLVED_VIRTUAL_ID || id.startsWith(RESOLVED_VIRTUAL_ID + '?')) return testUserSource
        if (id === SANDBOX_RESOLVED_VIRTUAL_ID || id.startsWith(SANDBOX_RESOLVED_VIRTUAL_ID + '?')) return sandboxUserSource
        return null
      },
      configureServer(server) {
        server.middlewares.use('/__test/set-code', (req, res, next) => {
          if (req.method !== 'POST') return next()
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            testUserCode = body
            testUserSource = injectPreludeIntoSfc(testUserCode, testPrelude)
            const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID)
            if (mod) {
              server.moduleGraph.invalidateModule(mod)
            }
            res.statusCode = 200
            res.end('OK')
          });
          req.on('error', (e) => {
            console.error('Error:', e);
            res.statusCode = 500;
            res.end('Error')
          });
        });

        // Add handler for updating examples
        server.middlewares.use('/__test/update-example', (req, res, next) => {
          if (req.method !== 'POST') return next();
          let body = '';
          req.on('data', (chunk) => body += chunk);
          req.on('end', () => {
            try {
              const { component, name, code, isNew } = JSON.parse(body);
              const filePath = path.resolve(__dirname, `src/components/${component}.test.ts`);

              if (updateExampleInFile(filePath, name, code, isNew)) {
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } else {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, message: 'Failed to update file' }));
              }
            } catch (e) {
              console.error(e);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: String(e) }));
            }
          });
        });

        // Add handler for deleting examples
        server.middlewares.use('/__test/delete-example', (req, res, next) => {
          if (req.method !== 'POST') return next();
          let body = '';
          req.on('data', (chunk) => body += chunk);
          req.on('end', () => {
            try {
              const { component, name } = JSON.parse(body);
              const filePath = path.resolve(__dirname, `src/components/${component}.test.ts`);

              if (deleteExampleInFile(filePath, name)) {
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } else {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, message: 'Failed to delete example' }));
              }
            } catch (e) {
              console.error(e);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: String(e) }));
            }
          });
        });

        // 添加获取原始代码的端点
        server.middlewares.use('/__test/get-code', (req, res) => {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(testUserCode);
        });

        server.middlewares.use('/__test/iframe', (req, res) => {
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/test/sandbox/iframe-entry.ts"></script>
  </body>
</html>`)
        })

        server.middlewares.use('/__sandbox/set-code', (req, res, next) => {
          if (req.method !== 'POST') return next()
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            sandboxUserCode = body
            sandboxUserSource = injectPreludeIntoSfc(sandboxUserCode, sandboxPrelude)
            const mod = server.moduleGraph.getModuleById(SANDBOX_RESOLVED_VIRTUAL_ID)
            if (mod) {
              server.moduleGraph.invalidateModule(mod)
            }
            res.statusCode = 200
            res.end('OK')
          })
          req.on('error', (e) => {
            console.error('Error:', e);
            res.statusCode = 500;
            res.end('Error')
          })
        })

        server.middlewares.use('/__sandbox/get-code', (req, res) => {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(sandboxUserCode);
        })

        server.middlewares.use('/__sandbox/iframe', (req, res) => {
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/test/sandbox/iframe-entry.ts"></script>
  </body>
</html>`)
        })
      },
    }
  ],
  server: {
    port: 5173,
    hmr: {
      overlay: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }
})

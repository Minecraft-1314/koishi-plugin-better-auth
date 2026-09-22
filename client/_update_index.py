import os

path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.ts')
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import Profile from './profile.vue'",
    "import Profile from './profile.vue'\nimport ConfigPage from './config-page.vue'"
)

content = content.replace(
    "  ctx.page({\n    path: '/profile',\n    name: '用户资料',\n    icon: 'user-full',\n    fields: ['user'],\n    position: 'bottom',\n    order: 500,\n    component: Profile,\n  })\n\n  watch(() => store.user, (value) => {",
    "  ctx.page({\n    path: '/profile',\n    name: '用户资料',\n    icon: 'user-full',\n    fields: ['user'],\n    position: 'bottom',\n    order: 500,\n    component: Profile,\n  })\n\n  ctx.settings({\n    id: 'better-auth',\n    title: 'Better Auth',\n    order: 900,\n    component: ConfigPage,\n  })\n\n  watch(() => store.user, (value) => {"
)

with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print('client/index.ts updated')

<template>
  <div class="terminal_wrap">
    <div class="terminal_top">
      <div class="left_menu">
        <el-dropdown
          ref="hostDropdownRef"
          trigger="click"
          max-height="50vh"
          :teleported="false"
          class="dropdown_menu"
        >
          <span class="link_text">连接<el-icon><arrow-down /></el-icon></span>
          <template #dropdown>
            <el-cascader-panel
              v-if="hostGroupCascader"
              ref="hostGroupCascaderRef"
              style="width: fit-content"
              :props="{
                expandTrigger: 'hover',
              }"
              :options="formatHostGroupList"
              @change="handleLinkHost"
            />
            <el-dropdown-menu v-else>
              <el-dropdown-item
                class="link_close_all"
                @click="handleCloseAllTab"
              >
                <span>关闭所有连接</span>
              </el-dropdown-item>
              <el-dropdown-item
                v-for="(item, index) in hostList"
                :key="index"
                @click="handleLinkHost(item)"
              >
                {{ item.name }} {{ item.host }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown
          v-if="scriptLibrary"
          ref="scriptDropdownRef"
          trigger="click"
          max-height="50vh"
          :teleported="false"
          class="dropdown_menu"
        >
          <span class="link_text">脚本库<el-icon><arrow-down /></el-icon></span>
          <template #dropdown>
            <el-cascader-panel
              v-if="scriptLibraryCascader"
              ref="scriptCascaderRef"
              style="width: fit-content"
              :props="{
                expandTrigger: 'hover',
              }"
              :options="formatScriptList"
              @change="handleExecScript"
            />
            <el-dropdown-menu v-else>
              <el-dropdown-item
                v-for="item in scriptList"
                :key="item.id"
                @click="handleExecScript(item)"
              >
                <span :title="item.name">{{ item.name }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <el-dropdown trigger="click">
          <span class="link_text">分屏<el-icon><arrow-down /></el-icon></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleFullScreen">
                <span>双屏</span>
              </el-dropdown-item>
              <el-dropdown-item @click="handleFullScreen">
                <span>三屏</span>
              </el-dropdown-item>
              <el-dropdown-item @click="handleFullScreen">
                <span>四屏</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
        <el-dropdown trigger="click">
          <span class="link_text">功能项<el-icon><arrow-down /></el-icon></span>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item @click="showInputCommand = true">
                <span>长指令输入</span>
              </el-dropdown-item> -->
              <el-dropdown-item @click="handleFullScreen">
                <span>启用全屏</span>
              </el-dropdown-item>
              <el-dropdown-item @click="showSetting = true">
                <span>本地设置</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="right_overview">
        <div v-if="isMobileScreen" class="switch_wrap">
          <el-button
            :type="curHost?.monitorData?.connect ? 'success' : 'danger'"
            text
            @click="() => (showMobileInfoSideDialog = true)"
          >
            状态
          </el-button>
        </div>
        <div class="switch_wrap">
          <el-tooltip
            effect="dark"
            content="同步键盘输入到所有会话"
            placement="bottom"
          >
            <el-switch
              v-model="isSyncAllSession"
              class="swtich"
              inline-prompt
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
              active-text="同步"
              inactive-text="同步"
            />
          </el-tooltip>
        </div>
        <div class="switch_wrap">
          <el-tooltip
            effect="dark"
            content="包含SFTP文件传输、脚本库等功能"
            placement="bottom"
          >
            <el-switch
              v-model="showFooterBar"
              class="swtich"
              inline-prompt
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
              active-text="功能栏"
              inactive-text="功能栏"
            />
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-drawer
      v-if="isMobileScreen"
      v-model="showMobileInfoSideDialog"
      :with-header="false"
      direction="ltr"
      class="mobile_menu_drawer"
    >
      <InfoSide
        ref="infoSideRef"
        :host-info="curHost"
        :visible="visible"
        :ping-data="pingData"
      />
    </el-drawer>
    <div v-else class="info_box">
      <InfoSide
        ref="infoSideRef"
        :host-info="curHost"
        :visible="visible"
        :ping-data="pingData"
      />
    </div>
    <div class="terminal_and_sftp_wrap">
      <el-tabs
        v-model="activeTabIndex"
        type="border-card"
        tab-position="top"
        @tab-remove="removeTab"
        @tab-change="tabChange"
      >
        <el-tab-pane
          v-for="(item, index) in terminalTabs"
          :key="item.key"
          :label="item.name"
          :name="index"
          :closable="true"
          class="el_tab_pane"
        >
          <template #label>
            <div class="tab_label">
              <span
                class="tab_status"
                :style="{ background: getStatusColor(item.status) }"
              />
              <span>{{ item.name }}</span>
            </div>
          </template>
          <div class="tab_content_wrap" :style="{ height: mainHeight + 'px' }">
            <!-- @cd-command="cdCommand" -->
            <TerminalTab
              ref="terminalRefs"
              :host-obj="item"
              :long-press-ctrl="longPressCtrl"
              :long-press-alt="longPressAlt"
              @input-command="terminalInput"
              @ping-data="getPingData"
              @reset-long-press="resetLongPress"
            />
            <FloatMenu
              v-if="isMobileScreen"
              :long-press-ctrl="longPressCtrl"
              :long-press-alt="longPressAlt"
              @click-key="handleClickVirtualKeyboard"
            />
            <FooterBar
              v-if="showFooterBar"
              :host-id="item.id"
              @resize="resizeTerminal"
              @exec-command="handleInputCommand"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <InputCommand
      v-model:show="showInputCommand"
      @input-command="handleInputCommand"
    />

    <HostForm
      v-model:show="hostFormVisible"
      :default-data="updateHostData"
      @update-list="handleUpdateList"
      @closed="updateHostData = null"
    />

    <TerminalSetting v-model:show="showSetting" />
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  getCurrentInstance,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import useMobileWidth from '@/composables/useMobileWidth'
import InputCommand from '@/components/input-command/index.vue'
import FloatMenu from '@/components/float-menu/index.vue'
import { terminalStatusList, virtualKeyType } from '@/utils/enum'
import TerminalTab from './terminal-tab.vue'
import InfoSide from './info-side.vue'
import HostForm from '../../server/components/host-form.vue'
import TerminalSetting from './terminal-setting.vue'
import FooterBar from './footer-bar.vue'

const {
  proxy: { $nextTick, $store, $message }
} = getCurrentInstance()

const props = defineProps({
  terminalTabs: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['closed', 'close-all-tab', 'removeTab', 'add-host',])
const hostGroupAll = 'host-group-all-'
const { isMobileScreen } = useMobileWidth()
const showInputCommand = ref(false)
const infoSideRef = ref(null)
const pingData = ref({})
const terminalRefs = ref([])
// const sftpRefs = ref([])
const activeTabIndex = ref(0)
const visible = ref(true)
const showFooterBar = ref(localStorage.getItem('showFooterBar') === 'true')
const isSyncAllSession = ref(false)
const mainHeight = ref('')
const hostFormVisible = ref(false)
const updateHostData = ref(null)
const showSetting = ref(false)
const showMobileInfoSideDialog = ref(false)
const longPressCtrl = ref(false)
const longPressAlt = ref(false)
const scriptDropdownRef = ref(null)
const scriptCascaderRef = ref(null)
const hostGroupCascaderRef = ref(null)
const hostDropdownRef = ref(null)

const isPlusActive = computed(() => $store.isPlusActive)
const terminalTabs = computed(() => props.terminalTabs)
const terminalTabsLen = computed(() => props.terminalTabs.length)
const hostGroupList = computed(() => $store.groupList)
const hostList = computed(() => $store.hostList)
const curHost = computed(() =>
  hostList.value.find(
    (item) => item.host === terminalTabs.value[activeTabIndex.value]?.host
  )
)
const scriptGroupList = computed(() => $store.scriptGroupList)
const scriptList = computed(() => $store.scriptList)
const scriptLibrary = computed(() => $store.menuSetting.scriptLibrary)
const scriptLibraryCascader = computed(
  () => $store.menuSetting.scriptLibraryCascader
)
const hostGroupCascader = computed(() => $store.menuSetting.hostGroupCascader)
const formatHostGroupList = computed(() => {
  const groupList = hostList.value.reduce((acc, item) => {
    const groupName = hostGroupList.value.find((group) => group.id === item.group)?.name
    if (!acc[groupName]) {
      acc[groupName] = []
    }
    acc[groupName].push(item)
    return acc
  }, {})
  const result = Object.entries(groupList)
    .map(([groupName, hosts,]) => {
      const children = hosts.map((host) => ({
        value: host.id,
        label: host.name
      }))
      if (hosts.length > 1) {
        children.unshift({
          value: `${ hostGroupAll }${ hosts[0].group }`,
          label: '全部连接'
        })
      }
      return {
        value: groupName,
        label: groupName,
        children
      }
    })
  result.unshift({
    value: 'closeAll',
    label: '关闭所有连接'
  })
  return result
})
const formatScriptList = computed(() => {
  const scriptsByGroup = scriptList.value.reduce((acc, script) => {
    const groupId = script.group || 'default'
    if (!acc[groupId]) {
      acc[groupId] = []
    }
    acc[groupId].push({
      value: script.id,
      label: script.name,
      command: script.command // 保存command用于执行脚本
    })
    return acc
  }, {})
  return scriptGroupList.value.map((group) => ({
    value: group.id,
    label: group.name,
    children: scriptsByGroup[group.id] || []
  }))
})

onMounted(() => {
  handleResizeTerminalSftp()
  window.addEventListener('resize', handleResizeTerminalSftp)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResizeTerminalSftp)
})

const getStatusColor = (status) => {
  return (
    terminalStatusList.find((item) => item.value === status)?.color || 'gray'
  )
}

const handleUpdateList = async ({ host }) => {
  try {
    await $store.getHostList()
    let targetHost = hostList.value.find((item) => item.host === host)
    if (targetHost) emit('add-host', targetHost)
  } catch (err) {
    $message.error('获取实例列表失败')
    console.error('获取实例列表失败: ', err)
  }
}

const handleResizeTerminalSftp = () => {
  $nextTick(() => {
    mainHeight.value =
      document.querySelector('.terminal_and_sftp_wrap')?.offsetHeight - 45 // 45 is tab-header height+15
  })
}

const handleCloseAllTab = () => {
  emit('close-all-tab')
}

const { LONG_PRESS, SINGLE_PRESS } = virtualKeyType
const handleClickVirtualKeyboard = async (virtualKey) => {
  const { key, ansi, type } = virtualKey
  // console.log(key, ascii, ansi, type)
  switch (type) {
    case LONG_PRESS:
      // console.log('待组合键')
      if (key === 'Ctrl') {
        longPressCtrl.value = true
        longPressAlt.value = false
      }
      if (key === 'Alt') {
        longPressAlt.value = true
        longPressCtrl.value = false
      }
      // eslint-disable-next-line no-case-declarations
      const curTerminalRef = terminalRefs.value[activeTabIndex.value]
      await $nextTick()
      curTerminalRef?.focusTab()
      break
    case SINGLE_PRESS:
      longPressCtrl.value = false
      longPressAlt.value = false
      handleExecScript({ command: ansi })
      break
    default:
      break
  }
}

const resetLongPress = () => {
  longPressCtrl.value = false
  longPressAlt.value = false
}

const handleLinkHost = (hostDescObj) => {
  if (!hostDescObj) return // clearCheckedNodes二次触发change事件
  const id = Array.isArray(hostDescObj) ? hostDescObj.slice(-1)[0] : hostDescObj.id
  if (id === 'closeAll') return handleCloseAllTab()
  if (id.startsWith(hostGroupAll)) {
    const groupId = id.split(hostGroupAll)[1]
    const hosts = hostList.value.filter((host) => host.group === groupId)
    const configHosts = hosts.filter((host) => host.isConfig)
    if (configHosts.length > 0) {
      configHosts.forEach((host) => {
        emit('add-host', host)
      })
    } else {
      $message.warning('请先配置SSH连接信息')
    }
  } else {
    const host = hostList.value.find((item) => item.id === id)
    if (!host.isConfig) {
      $message.warning('请先配置SSH连接信息')
      hostFormVisible.value = true
      updateHostData.value = { ...host }
      return
    }
    emit('add-host', host)
  }
  setTimeout(() => {
    hostGroupCascaderRef.value?.clearCheckedNodes()
    hostDropdownRef.value?.handleClose()
  }, 100)
}

const handleExecScript = async (scriptDescObj) => {
  if (!scriptDescObj) return // clearCheckedNodes二次触发change事件
  const id = Array.isArray(scriptDescObj) ? scriptDescObj.slice(-1)[0] : scriptDescObj.id
  const script = scriptList.value.find((item) => item.id === id)
  if (!script) return $message.warning('未找到对应的脚本')

  const command = script.command
  if (!isSyncAllSession.value) {
    await handleInputCommand(command)
  } else {
    terminalRefs.value.forEach((terminalRef) => {
      terminalRef.inputCommand(command)
    })
  }

  await $nextTick()
  setTimeout(() => {
    scriptCascaderRef.value?.clearCheckedNodes()
    scriptDropdownRef.value?.handleClose()
  }, 100)
}

const terminalInput = (command) => {
  if (!isSyncAllSession.value) return
  let filterTerminalRefs = terminalRefs.value.filter((host, index) => {
    return index !== activeTabIndex.value
  })
  filterTerminalRefs.forEach((hostRef) => {
    hostRef.inputCommand(command, true)
  })
}

// 识别命令动态切换目录功能暂时取消
// const cdCommand = (path) => {
//   // console.log('cdCommand:', path)
//   if (!showSftp.value) return
//   if (isSyncAllSession.value) {
//     sftpRefs.value.forEach(sftpRef => {
//       sftpRef.openDir(path)
//     })
//   } else {
//     sftpRefs.value[activeTabIndex.value].openDir(path, false)
//   }
// }

const getPingData = (data) => {
  pingData.value[data.ip] = data
}

const tabChange = async (index) => {
  await $nextTick()
  const curTerminalRef = terminalRefs.value[index]
  curTerminalRef?.focusTab()
}

watch(
  terminalTabsLen,
  () => {
    let len = terminalTabsLen.value
    // console.log('add tab:', len)
    if (len > 0) {
      activeTabIndex.value = len - 1
      // registryDbClick()
      tabChange(activeTabIndex.value)
    }
  },
  {
    immediate: true,
    deep: false
  }
)

watch(
  showFooterBar,
  async () => {
    localStorage.setItem('showFooterBar', showFooterBar.value)
    await $nextTick()
    resizeTerminal()
  },
  {
    immediate: true,
    deep: false
  }
)

const removeTab = (index) => {
  emit('removeTab', index)
  if (index === activeTabIndex.value) {
    nextTick(() => {
      activeTabIndex.value = 0
    })
  }
}

const handleFullScreen = () => {
  document
    .getElementsByClassName('terminal_and_sftp_wrap')[0]
    .requestFullscreen()
}

// const registryDbClick = () => {
//   $nextTick(() => {
//     let tabItems = Array.from(document.getElementsByClassName('el-tabs__item'))
//     tabItems.forEach(item => {
//       item.removeEventListener('dblclick', handleDblclick)
//       item.addEventListener('dblclick', handleDblclick)
//     })
//   })
// }

// const handleDblclick = (e) => {
//   let key = e.target.id.substring(4)
//   removeTab(key)
// }

const resizeTerminal = () => {
  for (let terminalTabRef of terminalRefs.value) {
    const { handleResize } = terminalTabRef || {}
    handleResize && handleResize()
  }
}

const handleInputCommand = async (command) => {
  const curTerminalRef = terminalRefs.value[activeTabIndex.value]
  await $nextTick()
  curTerminalRef?.focusTab()
  curTerminalRef.inputCommand(`${ command }`)
  showInputCommand.value = false
}
</script>

<style lang="scss" scoped>
.terminal_wrap {
  display: flex;
  flex-wrap: wrap;
  height: 100%;

  :deep(.el-tabs__content) {
    // width: 100%;
    padding: 0 0 5px 0;
  }

  :deep(.el-tabs--border-card) {
    border: none;
  }

  :deep(.el-tabs__nav-wrap.is-scrollable.is-top) {
    display: flex;
    align-items: center;
  }

  $terminalTopHeight: 30px;

  .terminal_top {
    width: 100%;
    height: $terminalTopHeight;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px 0 15px;
    position: sticky;
    top: 0;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-regular);
    z-index: 3;
    user-select: none;

    // :deep(.el-dropdown) {
    //   margin-top: -2px;
    // }
    .dropdown_menu {
      :deep(.el-dropdown-menu) {
        min-width: 120px;
        max-width: 300px;
      }
    }

    .link_text {
      font-size: var(--el-font-size-base);
      color: var(--el-text-color-regular);
      // color: var(--el-color-primary);
      cursor: pointer;
      margin-right: 10px;

      .hidden_icon {
        opacity: 0;
      }
    }

    .left_menu {
      display: flex;
      align-items: center;
    }

    .right_overview {
      display: flex;
      align-items: center;

      .switch_wrap {
        display: flex;
        align-items: center;
        margin-right: 5px;
      }

      .full_icon {
        cursor: pointer;

        &:hover .icon {
          color: var(--el-color-primary);
        }
      }
    }
  }

  .info_box {
    height: calc(100% - $terminalTopHeight);
    overflow: auto;
    display: flex;
    flex-direction: column;
    border: var(--el-descriptions-table-border);
  }

  .terminal_and_sftp_wrap {
    height: calc(100% - $terminalTopHeight);
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;

    .tab_label {
      display: flex;
      align-items: center;
      justify-content: center;

      .tab_status {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 5px;
        transition: all 0.5s;
        // background-color: var(--el-color-primary);
      }
    }

    .tab_content_wrap {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      :deep(.terminal_tab_container) {
        flex: 1;
      }
    }

    .full-screen-button {
      position: absolute;
      right: 10px;
      top: 4px;
      z-index: 99999;
    }
  }

  .visible {
    position: absolute;
    z-index: 999999;
    top: 13px;
    left: 5px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>

<style>
.action_icon {
  color: var(--el-color-primary);
}

.link_close_all:hover {
  color: #ff4949 !important;
}
</style>

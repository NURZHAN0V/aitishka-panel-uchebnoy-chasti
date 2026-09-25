import { computed, ref } from 'vue'
import {
  createInitialPhotoRequests,
  createInitialYandexRequests,
  YANDEX_COINS_REWARD,
} from '@/modules/moderation/constants/moderation.js'

const photoQueue = ref(createInitialPhotoRequests())
const yandexQueue = ref(createInitialYandexRequests())
const tutorialVideoName = ref('yandex-review-tutorial.mp4')
/** studentId → уже начислили коины за Яндекс */
const yandexRewardedIds = ref(new Set())

export function useModerationPhotos() {
  const rejectOpen = ref(false)
  const rejectTargetId = ref(null)
  const rejectReason = ref('')

  const queue = computed(() => photoQueue.value)

  function approve(id) {
    const idx = photoQueue.value.findIndex((item) => item.id === id)
    if (idx === -1) return false
    photoQueue.value.splice(idx, 1)
    return true
  }

  function openReject(id) {
    rejectTargetId.value = id
    rejectReason.value = ''
    rejectOpen.value = true
  }

  function closeReject() {
    rejectOpen.value = false
    rejectTargetId.value = null
    rejectReason.value = ''
  }

  function confirmReject() {
    const reason = rejectReason.value.trim()
    if (!reason || !rejectTargetId.value) return false
    const idx = photoQueue.value.findIndex((item) => item.id === rejectTargetId.value)
    if (idx === -1) return false
    photoQueue.value.splice(idx, 1)
    closeReject()
    return true
  }

  return {
    queue,
    rejectOpen,
    rejectReason,
    approve,
    openReject,
    closeReject,
    confirmReject,
  }
}

export function useModerationYandex() {
  const rejectOpen = ref(false)
  const rejectTargetId = ref(null)
  const rejectReason = ref('')
  const videoFile = ref(null)

  const queue = computed(() => yandexQueue.value)
  const tutorialName = computed(() => tutorialVideoName.value)

  function verify(id) {
    const item = yandexQueue.value.find((r) => r.id === id)
    if (!item) return { ok: false, coins: 0 }

    const already = yandexRewardedIds.value.has(item.studentId) || item.coinsAwarded
    const coins = already ? 0 : YANDEX_COINS_REWARD

    if (!already) {
      yandexRewardedIds.value.add(item.studentId)
      item.coinsAwarded = true
    }

    const idx = yandexQueue.value.findIndex((r) => r.id === id)
    if (idx !== -1) yandexQueue.value.splice(idx, 1)

    return { ok: true, coins, already }
  }

  function openReject(id) {
    rejectTargetId.value = id
    rejectReason.value = ''
    rejectOpen.value = true
  }

  function closeReject() {
    rejectOpen.value = false
    rejectTargetId.value = null
    rejectReason.value = ''
  }

  function confirmReject() {
    const reason = rejectReason.value.trim()
    if (!reason || !rejectTargetId.value) return false
    const idx = yandexQueue.value.findIndex((item) => item.id === rejectTargetId.value)
    if (idx === -1) return false
    yandexQueue.value.splice(idx, 1)
    closeReject()
    return true
  }

  function setTutorialVideo(file) {
    if (!file) return false
    videoFile.value = file
    tutorialVideoName.value = file.name || 'tutorial.mp4'
    return true
  }

  return {
    queue,
    tutorialName,
    videoFile,
    rejectOpen,
    rejectReason,
    verify,
    openReject,
    closeReject,
    confirmReject,
    setTutorialVideo,
    YANDEX_COINS_REWARD,
  }
}

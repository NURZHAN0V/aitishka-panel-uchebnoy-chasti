/** Моки очередей модерации */

export function createInitialPhotoRequests() {
  return [
    {
      id: 'photo-1',
      studentId: 's1',
      studentName: 'Алина Петрова',
      previewLabel: 'photo_alina.jpg',
      submittedAt: '2026-09-24T11:20:00',
    },
    {
      id: 'photo-2',
      studentId: 's2',
      studentName: 'Максим Орлов',
      previewLabel: 'avatar_max.png',
      submittedAt: '2026-09-24T15:05:00',
    },
    {
      id: 'photo-3',
      studentId: 's5',
      studentName: 'Ева Кузнецова',
      previewLabel: 'eva_profile.jpg',
      submittedAt: '2026-09-25T09:40:00',
    },
  ]
}

export function createInitialYandexRequests() {
  return [
    {
      id: 'yx-1',
      studentId: 's3',
      studentName: 'София Иванова',
      linkStub: 'yandex.ru/maps/org/…/reviews/sof-0310',
      submittedAt: '2026-09-23T18:10:00',
      coinsAwarded: false,
    },
    {
      id: 'yx-2',
      studentId: 's4',
      studentName: 'Даниил Смирнов',
      linkStub: 'yandex.ru/maps/org/…/reviews/dan-0444',
      submittedAt: '2026-09-24T12:00:00',
      coinsAwarded: false,
    },
    {
      id: 'yx-3',
      studentId: 's1',
      studentName: 'Алина Петрова',
      linkStub: 'yandex.ru/maps/org/…/reviews/aln-0142',
      submittedAt: '2026-09-25T08:30:00',
      coinsAwarded: false,
    },
  ]
}

export const YANDEX_COINS_REWARD = 10

import NextLocalFont from 'next/font/local'

const HiraginoKakuGothicProNFont = NextLocalFont({
  variable: '--font-sans',
  display: 'swap',
  src: [
    {
      path: '../../assets/fonts/HiraginoKakuGothicProN-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../assets/fonts/HiraginoKakuGothicProN-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../assets/fonts/HiraginoKakuGothicProN-Bold.ttf',
      weight: '700',
    },
  ],
})

export { HiraginoKakuGothicProNFont }

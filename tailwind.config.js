/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
    'node_modules/flowbite-react/lib/esm/**/*.js',],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      colors: {
        //incomeBC: '#62956A',
        // incomeBC: '#00DDA2',
        // incomeHover: '#00E7B1',
        // incomeAmount: '#048320',
        // //incomeHover: '#5fad5f',
        // focusColor:'#767575',
        // //incomeBC: '#73B285',
        // //incomeBC:'#98E0AC',
        // //expenseBC: '#C4896F',
        // expenseBC: '#334050',
        // expenseHover: '#28323e',
        // expenseAmount: '#CC0909',
        // blurBC: '#E0FFEF',
        //expenseHover: '#da997d',
        //golden: '#CDA618'
        //golden: '#B5710A',
        //goldenHover: '#bc8736',
        incomeBC: '#20ab86',
        incomeHover: '#00E7B1',
        incomeAmount: '#048320',
        //incomeHover: '#5fad5f',
        focusColor:'#767575',
        expenseBC: '#b85f1fc7',
        expenseHover: '#a7551bc7',
        expenseAmount: '#CC0909',
        blurBC: '#E0FFEF',
        golden: '#B5C6C5',
        goldenHover: '#BDCDCC',
        textColor:'#FFFFF',
        subText: '#454545',
        error: '#ef4444',
        // incomeBC: '#1075D0 ',
        // incomeHover: '#0269C6',
        // incomeAmount: '#048320',
        // focusColor:'#767575',
        // expenseBC: '#F7E000',
        // expenseHover: '#EAD503',
        // expenseAmount: '#CC0909',
        // blurBC: '#E8F2FE',
        // golden: '#A0CEF8',
        // goldenHover: '#E8F2FE',
        // textColor:'#FFFFF',
        // subText: '#454545',
        // error: '#ef4444'
      },
      backgroundImage: {
        'credit-card': "url('/images/creditCard.png')",
        'voucher': "url('/images/voucherNew.png')",
        'bgExpenses': "url('/images/bgExpenses-01.jpeg')",
        'bgIncome': "url('/images/bgIncome.jpeg')",
        'back': "url('/images/wallback.png')"
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
    },
  },
  variants: {
    extend: {
      backdropBlur: ['hover', 'focus'],
    }
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
}


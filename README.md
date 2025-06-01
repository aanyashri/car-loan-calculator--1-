# Car Loan Eligibility Calculator (JSX Version)

A comprehensive React-based car loan eligibility calculator that determines loan eligibility based on FOIR (Fixed Obligation to Income Ratio).

## Features

- **FOIR Calculation**: Real-time calculation based on income and obligations
- **Dynamic EMI Management**: Add/remove existing EMIs
- **Color-coded Results**: Visual indicators for eligibility status
- **Responsive Design**: Works on all devices
- **Comprehensive Analysis**: Detailed financial breakdown

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Extract the zip file
2. Navigate to the project directory:
   \`\`\`bash
   cd car-loan-calculator
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Personal Details**: Enter your name and age
2. **Income Details**: Add monthly salary and other income sources
3. **Existing EMIs**: Add all current loan EMIs and obligations
4. **Loan Parameters**: Set desired loan amount, interest rate, and tenure
5. **Monthly Expenses**: Add other monthly expenses

The calculator will automatically:
- Calculate your FOIR percentage
- Determine loan eligibility
- Show maximum eligible loan amount
- Provide recommendations

## FOIR Guidelines

- **≤ 40%**: Eligible (Green)
- **40-50%**: Marginal (Yellow) 
- **> 50%**: Not Eligible (Red)

## Technologies Used

- Next.js 14
- React 18
- JavaScript (JSX)
- Tailwind CSS
- Shadcn/ui Components
- Lucide React Icons

## Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## License

MIT License

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, Car, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function CarLoanCalculator() {
  const [loanData, setLoanData] = useState({
    name: "",
    age: 25,
    monthlyIncome: 0,
    otherIncome: 0,
    existingEMIs: [],
    loanAmount: 500000,
    interestRate: 8.5,
    tenure: 60,
    monthlyExpenses: 0,
  })

  const [result, setResult] = useState(null)

  // Calculate EMI using formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateEMI = (principal, rate, tenure) => {
    const monthlyRate = rate / (12 * 100)
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    return emi
  }

  // Calculate maximum eligible loan amount
  const calculateMaxEligibleAmount = (income, existingEMIs, rate, tenure) => {
    const maxFOIR = 40 // 40% FOIR limit
    const maxAllowedEMI = (income * maxFOIR) / 100 - existingEMIs

    if (maxAllowedEMI <= 0) return 0

    const monthlyRate = rate / (12 * 100)
    const maxAmount =
      (maxAllowedEMI * (Math.pow(1 + monthlyRate, tenure) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, tenure))

    return Math.max(0, maxAmount)
  }

  // Perform calculations
  useEffect(() => {
    const totalIncome = loanData.monthlyIncome + loanData.otherIncome
    const totalEMIs = loanData.existingEMIs.reduce((sum, emi) => sum + emi.amount, 0)
    const proposedEMI = calculateEMI(loanData.loanAmount, loanData.interestRate, loanData.tenure)
    const totalObligations = totalEMIs + proposedEMI
    const foir = totalIncome > 0 ? (totalObligations / totalIncome) * 100 : 0
    const maxEligibleAmount = calculateMaxEligibleAmount(totalIncome, totalEMIs, loanData.interestRate, loanData.tenure)
    const disposableIncome = totalIncome - totalObligations - loanData.monthlyExpenses

    let eligibility = "not-eligible"
    if (foir <= 40) eligibility = "eligible"
    else if (foir <= 50) eligibility = "marginal"

    setResult({
      totalIncome,
      totalEMIs,
      proposedEMI,
      totalObligations,
      foir,
      eligibility,
      maxEligibleAmount,
      disposableIncome,
    })
  }, [loanData])

  const addEMI = () => {
    setLoanData((prev) => ({
      ...prev,
      existingEMIs: [
        ...prev.existingEMIs,
        {
          id: Date.now(),
          description: "",
          amount: 0,
        },
      ],
    }))
  }

  const updateEMI = (id, field, value) => {
    setLoanData((prev) => ({
      ...prev,
      existingEMIs: prev.existingEMIs.map((emi) => (emi.id === id ? { ...emi, [field]: value } : emi)),
    }))
  }

  const removeEMI = (id) => {
    setLoanData((prev) => ({
      ...prev,
      existingEMIs: prev.existingEMIs.filter((emi) => emi.id !== id),
    }))
  }

  const getEligibilityColor = (eligibility) => {
    switch (eligibility) {
      case "eligible":
        return "bg-green-100 text-green-800 border-green-200"
      case "marginal":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "not-eligible":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEligibilityIcon = (eligibility) => {
    switch (eligibility) {
      case "eligible":
        return <CheckCircle className="h-4 w-4" />
      case "marginal":
        return <AlertCircle className="h-4 w-4" />
      case "not-eligible":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Car Loan Eligibility Calculator</h1>
          </div>
          <p className="text-gray-600">
            Calculate your car loan eligibility based on FOIR (Fixed Obligation to Income Ratio)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={loanData.name}
                      onChange={(e) => setLoanData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={loanData.age}
                      onChange={(e) => setLoanData((prev) => ({ ...prev, age: Number.parseInt(e.target.value) || 0 }))}
                      placeholder="Enter your age"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Income Details */}
            <Card>
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Income Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Salary (₹)</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      value={loanData.monthlyIncome}
                      onChange={(e) =>
                        setLoanData((prev) => ({ ...prev, monthlyIncome: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Enter monthly salary"
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="otherIncome">Other Income (₹)</Label>
                    <Input
                      id="otherIncome"
                      type="number"
                      value={loanData.otherIncome}
                      onChange={(e) =>
                        setLoanData((prev) => ({ ...prev, otherIncome: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Rental, business income etc."
                      className="text-right"
                    />
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Monthly Income:</span>
                    <span className="text-lg font-bold text-green-600">
                      ₹{(loanData.monthlyIncome + loanData.otherIncome).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing EMIs */}
            <Card>
              <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Existing EMIs & Obligations
                </CardTitle>
                <CardDescription>Add all your existing loan EMIs and credit card payments</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {loanData.existingEMIs.map((emi, index) => (
                  <div key={emi.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                    <div>
                      <Label>EMI Description</Label>
                      <Input
                        value={emi.description}
                        onChange={(e) => updateEMI(emi.id, "description", e.target.value)}
                        placeholder="e.g., Home Loan, Personal Loan"
                      />
                    </div>
                    <div>
                      <Label>Monthly EMI (₹)</Label>
                      <Input
                        type="number"
                        value={emi.amount}
                        onChange={(e) => updateEMI(emi.id, "amount", Number.parseFloat(e.target.value) || 0)}
                        placeholder="Enter EMI amount"
                        className="text-right"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="destructive" size="sm" onClick={() => removeEMI(emi.id)} className="w-full">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <Button onClick={addEMI} variant="outline" className="w-full">
                  + Add Existing EMI
                </Button>

                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Existing EMIs:</span>
                    <span className="text-lg font-bold text-orange-600">
                      ₹{loanData.existingEMIs.reduce((sum, emi) => sum + emi.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Parameters */}
            <Card>
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Car Loan Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={loanData.loanAmount}
                      onChange={(e) =>
                        setLoanData((prev) => ({ ...prev, loanAmount: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Enter loan amount"
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={loanData.interestRate}
                      onChange={(e) =>
                        setLoanData((prev) => ({ ...prev, interestRate: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Enter interest rate"
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenure">Tenure (Months)</Label>
                    <Input
                      id="tenure"
                      type="number"
                      value={loanData.tenure}
                      onChange={(e) =>
                        setLoanData((prev) => ({ ...prev, tenure: Number.parseInt(e.target.value) || 0 }))
                      }
                      placeholder="Enter tenure"
                      className="text-right"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="monthlyExpenses">Other Monthly Expenses (₹)</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    value={loanData.monthlyExpenses}
                    onChange={(e) =>
                      setLoanData((prev) => ({ ...prev, monthlyExpenses: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="Household expenses, utilities etc."
                    className="text-right"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Eligibility Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Eligibility Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 ${getEligibilityColor(result.eligibility)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {getEligibilityIcon(result.eligibility)}
                        <span className="font-bold text-lg capitalize">{result.eligibility.replace("-", " ")}</span>
                      </div>
                      <div className="text-sm">
                        {result.eligibility === "eligible" && "Congratulations! You are eligible for the loan."}
                        {result.eligibility === "marginal" && "You may be eligible with additional documentation."}
                        {result.eligibility === "not-eligible" &&
                          "You may need to reduce loan amount or increase income."}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FOIR Calculation */}
                <Card>
                  <CardHeader>
                    <CardTitle>FOIR Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Income:</span>
                        <span className="font-medium">₹{result.totalIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Existing EMIs:</span>
                        <span className="font-medium">₹{result.totalEMIs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Proposed EMI:</span>
                        <span className="font-medium">₹{result.proposedEMI.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Total Obligations:</span>
                        <span className="font-bold">₹{result.totalObligations.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>FOIR:</span>
                        <Badge
                          className={`${
                            result.foir <= 40
                              ? "bg-green-100 text-green-800"
                              : result.foir <= 50
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.foir.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>

                    {/* FOIR Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>FOIR Limit</span>
                        <span>40% (Ideal) | 50% (Max)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            result.foir <= 40 ? "bg-green-500" : result.foir <= 50 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min(result.foir, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Max Eligible Amount:</span>
                      <span className="font-bold text-green-600">₹{result.maxEligibleAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disposable Income:</span>
                      <span
                        className={`font-medium ${result.disposableIncome >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        ₹{result.disposableIncome.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Tenure:</span>
                      <span className="font-medium">
                        {loanData.tenure} months ({(loanData.tenure / 12).toFixed(1)} years)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest:</span>
                      <span className="font-medium">
                        ₹{(result.proposedEMI * loanData.tenure - loanData.loanAmount).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {result.eligibility === "not-eligible" && (
                        <>
                          <p className="text-red-600">• Consider reducing the loan amount</p>
                          <p className="text-red-600">• Increase your monthly income</p>
                          <p className="text-red-600">• Pay off existing loans to reduce FOIR</p>
                        </>
                      )}
                      {result.eligibility === "marginal" && (
                        <>
                          <p className="text-yellow-600">• Consider a co-applicant</p>
                          <p className="text-yellow-600">• Provide additional income proof</p>
                          <p className="text-yellow-600">• Consider a longer tenure</p>
                        </>
                      )}
                      {result.eligibility === "eligible" && (
                        <>
                          <p className="text-green-600">• You have a healthy FOIR ratio</p>
                          <p className="text-green-600">• Consider negotiating interest rates</p>
                          <p className="text-green-600">• Maintain good credit score</p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

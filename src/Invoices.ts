export default class Invoices {
  installments: number
  price: number
  invoices: any[]

  constructor(price: number, installments: number) {
    this.price = price
    this.installments = installments
    this.invoices = []
  }
  generate() {
    const moduleTotalPrice = this.price
    const priceByMonth = parseFloat((moduleTotalPrice / this.installments).toFixed(2))
    const priceLastMonth = moduleTotalPrice - priceByMonth * (this.installments - 1)

    for (let paymentSlipIndex = this.installments; paymentSlipIndex > 0; paymentSlipIndex--) {
      if (paymentSlipIndex === 1) {
        this.invoices.push({ value: priceLastMonth })
      } else {
        this.invoices.push({ value: priceByMonth })
      }
    }
    return this.invoices
  }
}

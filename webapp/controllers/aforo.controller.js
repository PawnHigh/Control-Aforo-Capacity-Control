const aforoCtrl = {}
const AforoData = require('../models/aforo.model')

aforoCtrl.getAforo = async (req, res) => {
    const aforo = await AforoData.find()
    res.json(aforo)
}

aforoCtrl.setAforo = async (req, res) => {
    const { Capacity } = req.body
    const capacity = new AforoData({ Capacity })
    await capacity.save()
    res.json({status:'Established capacity'})
}

aforoCtrl.updateAforo = async (req, res) => {
    const { Capacity } = req.body
    await AforoData.findByIdAndUpdate(req.params.id, { Capacity })
    res.json({ status: 'Capacity Update' })
}

module.exports = aforoCtrl
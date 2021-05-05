import { create, all } from 'mathjs'
import integralExtend from 'mathjs-simple-integral'

const math = create(all)
console.log('integralExtend', integralExtend[0][0])
math.import(integralExtend[0][0])

export default math

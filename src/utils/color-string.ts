/**
 * Usage example:
 *
 * ```ts
 * ColorStr.new('Hello, world!')
 *  .white()
 *  .bgGreen()
 *  .bold()
 *  .underline()
 *  .toString()
 * ```
 */
export class ColorStr {
  private str: string
  private codes: number[] = []

  private constructor(str: string) {
    this.str = str
  }

  static new(data: any): ColorStr {
    return new ColorStr(String(data))
  }

  // 前景色
  black(): ColorStr {
    this.codes.push(30)
    return this
  }

  red(): ColorStr {
    this.codes.push(31)
    return this
  }

  green(): ColorStr {
    this.codes.push(32)
    return this
  }

  yellow(): ColorStr {
    this.codes.push(33)
    return this
  }

  blue(): ColorStr {
    this.codes.push(34)
    return this
  }

  magenta(): ColorStr {
    this.codes.push(35)
    return this
  }

  cyan(): ColorStr {
    this.codes.push(36)
    return this
  }

  white(): ColorStr {
    this.codes.push(37)
    return this
  }

  // 背景色
  bgBlack(): ColorStr {
    this.codes.push(40)
    return this
  }

  bgRed(): ColorStr {
    this.codes.push(41)
    return this
  }

  bgGreen(): ColorStr {
    this.codes.push(42)
    return this
  }

  bgMagenta(): ColorStr {
    this.codes.push(45)
    return this
  }

  bgCyan(): ColorStr {
    this.codes.push(46)
    return this
  }

  bgWhite(): ColorStr {
    this.codes.push(47)
    return this
  }

  // 样式
  bold(): ColorStr {
    this.codes.push(1)
    return this
  }

  dim(): ColorStr {
    this.codes.push(2)
    return this
  }

  italic(): ColorStr {
    this.codes.push(3)
    return this
  }

  underline(): ColorStr {
    this.codes.push(4)
    return this
  }

  blink(): ColorStr {
    this.codes.push(5)
    return this
  }

  reverse(): ColorStr {
    this.codes.push(7)
    return this
  }

  hidden(): ColorStr {
    this.codes.push(8)
    return this
  }

  strikethrough(): ColorStr {
    this.codes.push(9)
    return this
  }

  toString(): string {
    if (this.codes.length === 0)
      return this.str
    const prefix = `\x1B[${this.codes.join(';')}m`
    const suffix = '\x1B[0m'
    return `${prefix}${this.str}${suffix}`
  }
}

import React, { ReactNode } from 'react'
import BackgroundCss from './Background.module.css'
export default function Background({children}: {children: ReactNode} ): JSX.Element {
  return (
    <>
    <div className={BackgroundCss.container}>
        <section className={BackgroundCss.section}>
            {
                Array(259).fill(0).map(_ => <span className={BackgroundCss.span}></span>)
            }
            {
                children
            }
        </section>
    </div>
    </>
  )
}

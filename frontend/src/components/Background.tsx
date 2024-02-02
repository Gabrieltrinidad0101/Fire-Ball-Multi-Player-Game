import { ReactNode } from 'react'
import BackgroundCss from './Background.module.css'
export default function Background({children}: {children: ReactNode} ): JSX.Element {
  return (
    <>
    <div className={BackgroundCss.container}>
        <section className={BackgroundCss.section}>
            {
                // Math.random() is not correct but is only few project
                Array(259).fill(0).map(() => <span key={Math.random()} className={BackgroundCss.span}></span>)
            }
            {
                children
            }
        </section>
    </div>
    </>
  )
}

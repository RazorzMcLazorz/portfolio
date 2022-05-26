import { LanguageWordsOuter, LanguageWordsInner } from './constants'
import './styles.scss'

/**
 * @param small boolean
 */
function SkillsSpin() {
  return (
    <div id='skillsSpinContainer'>
      {LanguageWordsOuter.map((word, indx) => (
        <div
          className='spin'
          key={'skillSpinOuter' + indx}
          style={{ animationDelay: '-' + indx * 1.1 + 's' }}>
          <div className='words'>{word}</div>
        </div>
      ))}
      {LanguageWordsInner.map((word, indx) => (
        <div
          className='spinInner'
          key={'skillSpinInner' + indx}
          style={{ animationDelay: '-' + indx * 1.65 + 's' }}>
          <div className='words'>{word}</div>
        </div>
      ))}
    </div>
  )
}

export default SkillsSpin

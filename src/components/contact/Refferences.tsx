const refferences = [
  {
    name: 'Buck Brady',
    affiliation: 'CTO at Rovitracker.inc',
    phoneNumber: '385-207-6257',
    email: 'bbrady145@gmail.com',
    HIGTK: '',
  },
  {
    name: 'Taylor Millar',
    affiliation: 'Backend Developer at Rovitracker.inc',
    phoneNumber: '801-691-4362',
    email: 'millartaylor94@gmail.com',
    HIGTK: '',
  },
]

function Refferences({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className='Refferences'>
      <div className={isMobile ? 'ContactInfoNameMob' : 'RefferenceName'}>References</div>
      {refferences.map((refference, key) => (
        <div className='RefferenceContainer' key={key + 'ref'}>
          <div>
            {refference.name} - {refference.phoneNumber}
          </div>
          <div>{refference.email}</div>
          <div>{refference.affiliation}</div>
          <div className='RefferenceDivder' />
        </div>
      ))}
    </div>
  )
}

export default Refferences

'use client'

import { useEffect, useState } from 'react'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import Link from 'next/link'

interface PracticeTopic {
  id: string;
  title: string;
  description: string;
  image: string;
  unlocked: boolean;
}

interface PracticeSession {
  id: string;
  topicId: string;
  completedAt: string;
  score: number;
}

interface Word {
  word: string;
  sentence: string;
  options: string[];
  definition: string;
  pronunciation: string;
  vietnamese: string;
  example: string;
}

interface SummaryItem {
  word: string;
  correct: boolean;
  vietnamese: string;
}

const practiceTopics = [
  {
    id: 'advertising-practice',
    title: 'Thực hành: The Advertising Dilemma',
    description: 'Luyện tập từ vựng về sự bão hòa quảng cáo trong đời sống.',
    image: '/icons/con_01.webp',
    unlocked: true,
  },
  {
    id: 'teaching-methods-practice',
    title: 'Thực hành: Adapting Teaching Methods',
    description: 'Luyện tập các thuật ngữ liên quan đến phương pháp giáo dục hiệu quả.',
    image: '/images/teach.png',
    unlocked: true,
  },
  {
    id: 'environment-practice',
    title: 'Thực hành: Environmental Awareness',
    description: 'Luyện tập từ vựng về chiến lược giảm thiểu biến đổi khí hậu.',
    image: '/images/env.png',
    unlocked: false,
  },
  {
    id: 'health-practice',
    title: 'Thực hành: Health and Wellness',
    description: 'Luyện tập các thuật ngữ về sức khỏe thể chất và tinh thần.',
    image: '/images/health.png',
    unlocked: false,
  },
]

const wordList: Word[] = [
  { 
    word: 'government', 
    sentence: 'The ___ is responsible for making important decisions for the country.', 
    options: ['government', 'homeland', 'officials', 'attempt'], 
    definition: 'The government is responsible for making important decisions for the country.', 
    pronunciation: '/ˈɡʌvərnmənt/', 
    vietnamese: 'Chính phủ', 
    example: 'The government is responsible for making important decisions for the country.' 
  },
  { 
    word: 'whose', 
    sentence: '___ book is this on the table?', 
    options: ['whose', 'referred', 'South', 'African'], 
    definition: 'Whose book is this on the table?', 
    pronunciation: '/huːz/', 
    vietnamese: 'Của ai', 
    example: 'Whose book is this on the table?' 
  },
  { 
    word: 'homeland', 
    sentence: 'Many people feel a strong connection to their ___ and its traditions.', 
    options: ['homeland', 'prison', 'statement', 'referred'], 
    definition: 'Many people feel a strong connection to their homeland and its traditions.', 
    pronunciation: '/ˈhoʊmlænd/', 
    vietnamese: 'Tổ quốc', 
    example: 'Many people feel a strong connection to their homeland and its traditions.' 
  },
  { 
    word: 'officials', 
    sentence: 'The ___ are investigating the recent incident at the factory.', 
    options: ['officials', 'attempt', 'South', 'champion'], 
    definition: 'The officials are investigating the recent incident at the factory.', 
    pronunciation: '/əˈfɪʃəlz/', 
    vietnamese: 'Quan chức', 
    example: 'The officials are investigating the recent incident at the factory.' 
  },
  { 
    word: 'attempt', 
    sentence: 'They made a brave ___ to rescue the stranded hikers.', 
    options: ['attempt', 'referred', 'Economic', 'African'], 
    definition: 'They made a brave attempt to rescue the stranded hikers.', 
    pronunciation: '/əˈtɛmpt/', 
    vietnamese: 'Sự cố gắng', 
    example: 'They made a brave attempt to rescue the stranded hikers.' 
  },
  { 
    word: 'referred', 
    sentence: 'She ___ to the document during the meeting for clarification.', 
    options: ['referred', 'South', 'champion', 'who'], 
    definition: 'She referred to the document during the meeting for clarification.', 
    pronunciation: '/rɪˈfɜːrd/', 
    vietnamese: 'Đề cập', 
    example: 'She referred to the document during the meeting for clarification.' 
  },
  { 
    word: 'South', 
    sentence: 'The climate in the ___ is much warmer than in the North.', 
    options: ['South', 'Economic', 'African', 'who'], 
    definition: 'The climate in the South is much warmer than in the North.', 
    pronunciation: '/saʊθ/', 
    vietnamese: 'Phía Nam', 
    example: 'The climate in the South is much warmer than in the North.' 
  },
  { 
    word: 'champion', 
    sentence: 'He became a ___ in the national chess tournament last year.', 
    options: ['champion', 'African', 'who', 'are'], 
    definition: 'He became a champion in the national chess tournament last year.', 
    pronunciation: '/ˈtʃæmpiən/', 
    vietnamese: 'Nhà vô địch', 
    example: 'He became a champion in the national chess tournament last year.' 
  },
  { 
    word: 'Economic', 
    sentence: 'The ___ growth of the region has been impressive this decade.', 
    options: ['Economic', 'African', 'who', 'are'], 
    definition: 'The economic growth of the region has been impressive this decade.', 
    pronunciation: '/ˌiːkəˈnɒmɪk/', 
    vietnamese: 'Kinh tế', 
    example: 'The economic growth of the region has been impressive this decade.' 
  },
  { 
    word: 'African', 
    sentence: 'The ___ culture is rich with diverse traditions and languages.', 
    options: ['African', 'who', 'are', 'null'], 
    definition: 'The African culture is rich with diverse traditions and languages.', 
    pronunciation: '/ˈæfrɪkən/', 
    vietnamese: 'Châu Phi', 
    example: 'The African culture is rich with diverse traditions and languages.' 
  },
  { 
    word: 'who', 
    sentence: '___ is responsible for organizing this event?', 
    options: ['who', 'are', 'null', 'null'], 
    definition: 'Who is responsible for organizing this event?', 
    pronunciation: '/huː/', 
    vietnamese: 'Ai', 
    example: 'Who is responsible for organizing this event?' 
  },
  { 
    word: 'are', 
    sentence: 'They ___ planning to visit the museum tomorrow.', 
    options: ['are', 'null', 'null', 'null'], 
    definition: 'They are planning to visit the museum tomorrow.', 
    pronunciation: '/ɑːr/', 
    vietnamese: 'Là', 
    example: 'They are planning to visit the museum tomorrow.' 
  },
]

export default function PracticePage() {
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0)
  const [currentWord, setCurrentWord] = useState<Word>(wordList[0])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showDefinition, setShowDefinition] = useState<boolean>(false)
  const [summary, setSummary] = useState<SummaryItem[]>([])
  const [isSummaryVisible, setIsSummaryVisible] = useState<boolean>(false)
  const [totalWords] = useState<number>(wordList.length)
  const [correctCount, setCorrectCount] = useState<number>(0)
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false)

  useEffect(() => {
    async function fetchPracticeData() {
      try {
        const cachedData = localStorage.getItem('practiceData')
        const cachedTime = localStorage.getItem('practiceTime')

        if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime)) < 24 * 60 * 60 * 1000) {
          setPracticeSessions(JSON.parse(cachedData))
        } else {
          const res = await fetch('http://localhost:4000/api/practice', {
            credentials: 'include',
          })
          const practiceData = await res.json()
          setPracticeSessions(practiceData)
          localStorage.setItem('practiceData', JSON.stringify(practiceData))
          localStorage.setItem('practiceTime', Date.now().toString())
        }

        const resUser = await fetch('http://localhost:4000/api/me', {
          credentials: 'include',
        })
        const userData = await resUser.json()
        setUser(userData)
      } catch (error) {
        setError('Đã xảy ra lỗi khi tải dữ liệu thực hành')
      } finally {
        setLoading(false)
      }
    }

    fetchPracticeData()
  }, [])

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    if (isChecked && option === currentWord.word) {
      setShowDefinition(true)
      setShowCorrectAnswer(false)
      setCorrectCount(correctCount + 1)
    } else if (isChecked && option !== currentWord.word) {
      setShowDefinition(false)
      setShowCorrectAnswer(true)
    }
  }

  const handleCheck = () => {
    if (selectedOption) {
      setIsChecked(true)
      const isCorrect = selectedOption === currentWord.word
      setSummary([...summary, { word: currentWord.word, correct: isCorrect, vietnamese: currentWord.vietnamese }])
      if (isCorrect) {
        setShowDefinition(true)
        setShowCorrectAnswer(false)
        setCorrectCount(correctCount + 1)
      } else {
        setShowDefinition(false)
        setShowCorrectAnswer(true)
      }
    }
  }

  const handleContinue = () => {
    setSelectedOption(null)
    setShowDefinition(false)
    setIsChecked(false)
    setShowCorrectAnswer(false)

    const isCorrect = selectedOption === currentWord.word
    setSummary([...summary, { word: currentWord.word, correct: isCorrect, vietnamese: currentWord.vietnamese }])
    const nextWordIndex = currentWordIndex + 1
    if (nextWordIndex >= wordList.length) {
      setIsSummaryVisible(true)
    } else {
      setCurrentWordIndex(nextWordIndex)
      setCurrentWord(wordList[nextWordIndex])
    }
  }

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  const getPartOfSpeech = (word: string) => {
    const nouns = ['government', 'homeland', 'officials', 'attempt', 'South', 'champion', 'Economic', 'African']
    return nouns.includes(word.toLowerCase()) ? 'n' : 'pron'
  }

  return (
    <div className="min-h-screen bg-gray-100 relative" style={{ backgroundImage: 'url(/path/to/cloud-background.png)', backgroundSize: 'cover' }}>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Header />
      </div>
      <main className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-24 relative z-10">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => window.history.back()}>
          ×
        </button>
        {!isSummaryVisible ? (
          <>
            <h1 className="text-xl font-semibold text-center mb-6 text-black">Chọn từ thích hợp điền vào chỗ trống</h1>
            <div className="text-center mb-8">
              <p className="text-lg bg-green-100 p-3 rounded border border-green-300 inline-block text-black">
                {currentWord.sentence.split('___').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index === 0 && <input type="text" className="border-b-2 border-green-500 text-center w-40 mx-1 font-medium text-black" value={selectedOption || ''} readOnly />}
                  </span>
                ))}
              </p>
            </div>
            <div className="space-y-4 mb-8">
              {currentWord.options.map((option, index) => (
                <button
                  key={option}
                  className={`w-full py-3 px-4 rounded flex items-center justify-between border ${selectedOption === option ? (option === currentWord.word ? 'bg-green-500 border-green-600 text-white' : 'bg-red-500 border-red-600 text-white') : 'bg-gray-100 border-gray-300 text-black hover:bg-gray-200'} transition-colors duration-200`}
                  onClick={() => handleOptionSelect(option)}
                  disabled={!isChecked && selectedOption !== null}
                >
                  <span className="text-lg">{index + 1}. {option}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      playAudio(option)
                    }}
                    className="ml-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    🔊
                  </span>
                </button>
              ))}
            </div>
            {!showDefinition && (
              <>
                <button
                  className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition-colors duration-200"
                  onClick={handleCheck}
                  disabled={!selectedOption}
                >
                  Kiểm tra
                </button>
                {showCorrectAnswer && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-600 text-center">
                    Đáp án đúng là: <span className="font-semibold">{currentWord.word}</span>
                  </div>
                )}
              </>
            )}
            {showDefinition && (
              <div className="bg-green-500 text-white p-4 rounded-lg mt-4 relative">
                <button className="absolute top-2 right-2 text-white hover:text-gray-200" onClick={() => setShowDefinition(false)}>
                  ×
                </button>
                <h3 className="text-lg font-semibold">{currentWord.word} ({getPartOfSpeech(currentWord.word)})</h3>
                <p className="mt-2">
                  {currentWord.pronunciation}<br />
                  {currentWord.vietnamese}<br />
                  {currentWord.example}
                </p>
                <button
                  className="mt-4 w-full bg-white text-green-500 py-2 rounded hover:bg-gray-100 transition-colors duration-200"
                  onClick={handleContinue}
                >
                  Tiếp tục
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-yellow-500 mb-4">Wonderful!</h1>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full">
                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#e0e0e0" strokeWidth="10" />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="none"
                  stroke="#f4a261"
                  strokeWidth="10"
                  strokeDasharray={`${(correctCount / totalWords) * 100} ${100 - (correctCount / totalWords) * 100}`}
                  strokeDashoffset="25"
                />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-xl font-bold" fill="#f4a261">
                  {Math.round((correctCount / totalWords) * 100)}%
                </text>
              </svg>
            </div>
            <p className="text-lg text-yellow-500 mb-4">Bạn đã trả lời đúng {correctCount}/{totalWords} câu</p>
            <div className="space-y-2 mb-4">
              {summary.map((item, index) => (
                <div key={index} className={`flex items-center ${item.correct ? 'text-green-500' : 'text-red-500'}`}>
                  <span>{item.word}</span>
                  <span className="ml-2">{item.vietnamese}</span>
                  {item.correct ? '✔' : '✘'}
                </div>
              ))}
            </div>
            <button
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors duration-200"
              onClick={() => {
                setSummary([])
                setCorrectCount(0)
                setIsSummaryVisible(false)
                setCurrentWordIndex(0)
                setCurrentWord(wordList[0])
              }}
            >
              Tiếp tục
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

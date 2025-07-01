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
    word: 'deflation',
    sentence: 'Apart from Japan, the industrial world has not seen ___ for 70 years.',
    options: ['deflation', 'regulation', 'hard sell', 'value'],
    definition: 'Apart from Japan, the industrial world has not seen deflation for 70 years.',
    pronunciation: '/dɪˈfleɪʃn/',
    vietnamese: 'Giảm phát (sự giảm giá chung)',
    example: 'Apart from Japan, the industrial world has not seen deflation for 70 years.',
  },
  {
    word: 'regulation',
    sentence: 'The ___ of traffic ensures that vehicles follow specific rules to maintain order and safety.',
    options: ['regulation', 'import'],
    definition: 'The regulation of traffic ensures that vehicles follow specific rules to maintain order and safety.',
    pronunciation: '/ˌrɛɡjəˈleɪʃn/',
    vietnamese: 'Sự kiểm soát, quản lý',
    example: 'The regulation of traffic ensures that vehicles follow specific rules to maintain order and safety.',
  },
  {
    word: 'sustainability',
    sentence: 'The company focuses on ___ to reduce its environmental impact over the long term.',
    options: ['sustainability', 'inflation', 'marketing', 'deflation'],
    definition: 'The company focuses on sustainability to reduce its environmental impact over the long term.',
    pronunciation: '/səˌsteɪnəˈbɪlɪti/',
    vietnamese: 'Sự bền vững',
    example: 'The company focuses on sustainability to reduce its environmental impact over the long term.',
  },
  {
    word: 'innovation',
    sentence: 'The new technology represents a significant ___ in how we approach renewable energy.',
    options: ['innovation', 'regulation', 'value', 'hard sell'],
    definition: 'The new technology represents a significant innovation in how we approach renewable energy.',
    pronunciation: '/ˌɪnəˈveɪʃn/',
    vietnamese: 'Sự đổi mới',
    example: 'The new technology represents a significant innovation in how we approach renewable energy.',
  },
  {
    word: 'curriculum',
    sentence: 'The school updated its ___ to include more practical skills for students.',
    options: ['curriculum', 'sustainability', 'deflation', 'import'],
    definition: 'The school updated its curriculum to include more practical skills for students.',
    pronunciation: '/kəˈrɪkjələm/',
    vietnamese: 'Chương trình giảng dạy',
    example: 'The school updated its curriculum to include more practical skills for students.',
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
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false) // Track if we should show the correct answer

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
      setShowCorrectAnswer(false) // Hide correct answer if the new selection is correct
      setCorrectCount(correctCount + 1)
    } else if (isChecked && option !== currentWord.word) {
      setShowDefinition(false)
      setShowCorrectAnswer(true) // Show correct answer if the new selection is still incorrect
    }
  }

  const handleCheck = () => {
    if (selectedOption) {
      setIsChecked(true)
      const isCorrect = selectedOption === currentWord.word
      setSummary([...summary, { word: currentWord.word, correct: isCorrect, vietnamese: currentWord.vietnamese }])
      if (isCorrect) {
        setShowDefinition(true)
        setShowCorrectAnswer(false) // Don't show correct answer if the selection is correct
        setCorrectCount(correctCount + 1)
      } else {
        setShowDefinition(false)
        setShowCorrectAnswer(true) // Show correct answer if the selection is incorrect
      }
    }
  }

  const handleContinue = () => {
    setSelectedOption(null)
    setShowDefinition(false)
    setIsChecked(false)
    setShowCorrectAnswer(false) // Reset the correct answer display

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
    const nouns = ['regulation', 'deflation', 'import', 'joint venture', 'value', 'sustainability', 'innovation', 'curriculum']
    return nouns.includes(word.toLowerCase()) ? 'n' : 'adj'
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

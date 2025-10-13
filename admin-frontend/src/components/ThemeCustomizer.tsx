import { useState } from 'react'
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

interface ThemeCustomizerProps {
  isOpen: boolean
  onClose: () => void
}

export default function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const [lightMode, setLightMode] = useState(true)
  const [direction, setDirection] = useState('ltr')
  const [selectedColor, setSelectedColor] = useState('#5d87ff')
  const [layoutType, setLayoutType] = useState('vertical')
  const [containerType, setContainerType] = useState('boxed')
  const [sidebarType, setSidebarType] = useState('full')
  const [cardStyle, setCardStyle] = useState('shadow')
  const [borderRadius, setBorderRadius] = useState(7)

  const colorOptions = [
    { name: 'Blue', color: '#5d87ff' },
    { name: 'Aqua', color: '#49beff' },
    { name: 'Purple', color: '#7c3aed' },
    { name: 'Green', color: '#13deb9' },
    { name: 'Cyan', color: '#01c0c8' },
    { name: 'Orange', color: '#ffae1f' },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5eaef]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#5d87ff] rounded-lg">
              <Cog6ToothIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-[#2a3547]">Theme Option</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5a6a85] hover:text-[#2a3547] hover:bg-[#ecf2ff] rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Theme Mode */}
          <div>
            <h3 className="text-base font-semibold text-[#2a3547] mb-4">Theme Option</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setLightMode(true)}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  lightMode 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">Light</span>
              </button>
              <button
                onClick={() => setLightMode(false)}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  !lightMode 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">Dark</span>
              </button>
            </div>
          </div>

          {/* Theme Direction */}
          <div>
            <h3 className="text-base font-semibold text-[#2a3547] mb-4">Theme Direction</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setDirection('ltr')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  direction === 'ltr' 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">LTR</span>
              </button>
              <button
                onClick={() => setDirection('rtl')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  direction === 'rtl' 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">RTL</span>
              </button>
            </div>
          </div>

          {/* Theme Colors */}
          <div>
            <h3 className="text-base font-semibold text-[#2a3547] mb-4">Theme Colors</h3>
            <div className="grid grid-cols-6 gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => setSelectedColor(option.color)}
                  className={`aspect-square rounded-lg border-2 transition-colors ${
                    selectedColor === option.color 
                      ? 'border-[#2a3547] scale-110' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: option.color }}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          {/* Layout Type */}
          <div>
            <h3 className="text-base font-semibold text-[#2a3547] mb-4">Layout Type</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setLayoutType('vertical')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  layoutType === 'vertical' 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">Vertical</span>
              </button>
              <button
                onClick={() => setLayoutType('horizontal')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  layoutType === 'horizontal' 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">Horizontal</span>
              </button>
            </div>
          </div>

          {/* Container Option */}
          <div>
            <h3 className="text-base font-semibold text-[#2a3547] mb-4">Container Option</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setContainerType('boxed')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  containerType === 'boxed' 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">Boxed</span>
              </button>
              <button
                onClick={() => setContainerType('full')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  containerType === 'full' 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">Full</span>
              </button>
            </div>
          </div>

          {/* Sidebar Type */}
          <div>
            <h3 className="text-base font-semibold text-[#2a3547] mb-4">Sidebar Type</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setSidebarType('full')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  sidebarType === 'full' 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">Full</span>
              </button>
              <button
                onClick={() => setSidebarType('collapse')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  sidebarType === 'collapse' 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">Collapse</span>
              </button>
            </div>
          </div>

          {/* Card Style */}
          <div>
            <h3 className="text-base font-semibold text-[#2a3547] mb-4">Card With</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setCardStyle('border')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  cardStyle === 'border' 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">Border</span>
              </button>
              <button
                onClick={() => setCardStyle('shadow')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  cardStyle === 'shadow' 
                    ? 'border-[#5d87ff] bg-[#5d87ff]/5' 
                    : 'border-[#e5eaef] hover:border-[#5d87ff]/50'
                }`}
              >
                <span className="text-sm font-medium text-[#2a3547]">Shadow</span>
              </button>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <h3 className="text-base font-semibold text-[#2a3547] mb-4">Theme Border Radius</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5a6a85]">Current Value: {borderRadius}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full h-2 bg-[#ecf2ff] rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #5d87ff 0%, #5d87ff ${(borderRadius / 20) * 100}%, #ecf2ff ${(borderRadius / 20) * 100}%, #ecf2ff 100%)`
                }}
              />
            </div>
          </div>

          {/* Apply Button */}
          <button className="w-full bg-[#5d87ff] text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#4570ea] transition-colors">
            Apply Changes
          </button>
        </div>
      </div>
    </>
  )
}

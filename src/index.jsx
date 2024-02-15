import React from 'react'
import { createRoot } from 'react-dom/client'

import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'

import './app/styles/common.scss'

import App from './app/App'
import { MantineProvider } from '@mantine/core'

const rootElement = document.getElementById('app')

if (rootElement === null) {
  throw new Error('Error while initializing the application')
}

createRoot(rootElement).render(
  <MantineProvider defaultColorScheme="dark">
    <App />
  </MantineProvider>
)

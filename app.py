
import streamlit as st
import google.generativeai as genai
import os
import json
from datetime import datetime

# --- CONFIGURATION & SAFETY ---
APP_TITLE = "Med-Symptom Assistant"
AUTHORS = "Talha & Vareesha"
INSTITUTION = "Khyber Medical College, Peshawar"
BATCH = "Batch of 2030"
MOTTO = "Our Aim Is To Transform Patient Care In Pakistan"
MANDATORY_DISCLAIMER = "This information is provided for educational and informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare professional with any questions regarding a medical condition. In case of emergency, contact local emergency services immediately."

# Configure Gemini
api_key = os.getenv("API_KEY")
if api_key:
    genai.configure(api_key=api_key)

SYSTEM_PROMPT = f"""
You are a Medical Symptom Analysis & Health Education Assistant, developed by Talha & Vareesha (KMC).

STRICT PROTOCOLS:
1. NEVER provide a medical diagnosis. Frame everything as educational possibilities.
2. NEVER prescribe or recommend specific medications/dosages.
3. NEVER use definitive language like "You have".
4. EMERGENCY OVERRIDE: If symptoms are life-threatening (chest pain, shortness of breath), set 'is_emergency' to true.
5. Provide general medical education about broad treatment categories.

RESPONSE FORMAT:
You must return a valid JSON object:
{{
  "summary": "string",
  "considerations": ["string"],
  "red_flag_status": "Normal | Urgent | Emergency",
  "red_flag_details": "string",
  "next_steps": "string",
  "medical_education": "string",
  "is_emergency": boolean
}}
"""

# --- UI STYLING ---
def local_css():
    st.markdown(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
    
    html, body, [data-testid="stAppViewContainer"] {{
        background: linear-gradient(135deg, #fffafa 0%, #fff0f5 50%, #fdf2f8 100%);
        font-family: 'Inter', sans-serif;
    }}
    
    .main-card {{
        background: #0f172a;
        color: white;
        padding: 2.5rem;
        border-radius: 2rem;
        border: 1px solid #1e293b;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        margin-bottom: 2rem;
    }}
    
    .font-serif {{
        font-family: 'Playfair Display', serif;
        font-style: italic;
    }}
    
    .founder-card {{
        background: rgba(15, 23, 42, 0.95);
        padding: 2rem;
        border-radius: 3rem;
        border: 1px solid rgba(255,255,255,0.05);
        text-align: center;
        transition: transform 0.3s ease;
    }}
    
    .founder-img {{
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #e11d48;
        margin-bottom: 1rem;
    }}
    
    .motto-section {{
        text-align: center;
        padding: 5rem 1rem;
        background: white;
        margin-top: 4rem;
        border-top: 1px solid #ffe4e6;
    }}
    
    .stTextArea textarea {{
        background: #1e293b !important;
        color: white !important;
        border-radius: 1.5rem !important;
        border: 1px solid #334155 !important;
        padding: 1.5rem !important;
    }}
    
    .stButton button {{
        background: #e11d48 !important;
        color: white !important;
        border-radius: 1rem !important;
        padding: 0.75rem 2rem !important;
        font-weight: 800 !important;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        border: none !important;
    }}
    </style>
    """, unsafe_allow_html=True)

# --- APP LOGIC ---
def analyze(user_input):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=SYSTEM_PROMPT)
        response = model.generate_content(user_input)
        return json.loads(response.text)
    except Exception as e:
        st.error(f"Analysis Error: {str(e)}")
        return None

# --- UI LAYOUT ---
local_css()

# Header
col1, col2 = st.columns([1, 4])
with col1:
    st.markdown('<div style="background: #e11d48; padding: 10px; border-radius: 15px; text-align: center; color: white; font-weight: 800;">MED</div>', unsafe_allow_html=True)
with col2:
    st.title(APP_TITLE)
    st.caption(f"{INSTITUTION} | {BATCH}")

st.divider()

# Main Interface
with st.container():
    st.markdown(f"""
    <div class="main-card">
        <h2 style="color: #fb7185; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 1rem;">Educational Tool</h2>
        <h1 class="font-serif" style="font-size: 2.5rem; margin-bottom: 1rem;">Clinical Reasoning Explorer</h1>
        <p style="color: #94a3b8; font-size: 1.1rem;">Describe symptoms and medical history for an academic exploration of clinical possibilities.</p>
    </div>
    """, unsafe_allow_html=True)

    user_input = st.text_area("Patient History & Symptoms", placeholder="Enter details here...", height=200)
    
    if st.button("RUN CLINICAL ANALYSIS"):
        if not user_input:
            st.warning("Please enter some symptoms first.")
        else:
            with st.spinner("Analyzing Clinical Pathways..."):
                result = analyze(user_input)
                if result:
                    if result.get('is_emergency'):
                        st.error(f"### 🚨 EMERGENCY WARNING: {result['red_flag_details']}")
                    
                    res_col1, res_col2 = st.columns(2)
                    with res_col1:
                        st.markdown(f"""
                        <div style="background: white; padding: 2rem; border-radius: 2rem; border: 1px solid #ffe4e6;">
                            <h4 style="color: #e11d48; font-size: 0.7rem; text-transform: uppercase;">1. Summary</h4>
                            <p style="font-weight: 700; color: #0f172a;">{result['summary']}</p>
                            <h4 style="color: #e11d48; font-size: 0.7rem; text-transform: uppercase; margin-top: 1.5rem;">2. Considerations</h4>
                            <ul style="color: #475569;">{''.join([f"<li>{c}</li>" for c in result['considerations']])}</ul>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    with res_col2:
                        st.markdown(f"""
                        <div style="background: white; padding: 2rem; border-radius: 2rem; border: 1px solid #ffe4e6;">
                            <h4 style="color: #e11d48; font-size: 0.7rem; text-transform: uppercase;">3. Triage Status</h4>
                            <span style="background: #fff1f2; color: #e11d48; padding: 4px 12px; border-radius: 10px; font-weight: 800; font-size: 0.7rem;">{result['red_flag_status']}</span>
                            <p style="color: #64748b; font-size: 0.8rem; margin-top: 10px;">{result['red_flag_details']}</p>
                            <h4 style="color: #e11d48; font-size: 0.7rem; text-transform: uppercase; margin-top: 1.5rem;">4. Next Steps</h4>
                            <p style="font-weight: 800; color: #e11d48; font-style: italic;">{result['next_steps']}</p>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    st.markdown(f"""
                    <div style="background: #0f172a; padding: 3rem; border-radius: 3rem; color: white; margin-top: 2rem;">
                        <h4 style="color: #475569; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.4em;">5. Academic Medical Education</h4>
                        <p class="font-serif" style="font-size: 1.5rem; color: #cbd5e1;">{result['medical_education']}</p>
                        <hr style="border-color: #1e293b; margin: 2rem 0;">
                        <p style="font-size: 0.6rem; color: #475569; font-style: italic;">{MANDATORY_DISCLAIMER}</p>
                    </div>
                    """, unsafe_allow_html=True)

# Blogs Section
st.markdown('<div style="text-align: center; margin-top: 6rem;"><h2 class="font-serif" style="font-size: 3rem;">Latest Clinical Blogs</h2></div>', unsafe_allow_html=True)
blog_col1, blog_col2, blog_col3 = st.columns(3)
with blog_col1:
    st.markdown("""
    <div style="background: #0f172a; padding: 2rem; border-radius: 2rem; color: white;">
        <span style="color: #e11d48; font-weight: 800; font-size: 0.6rem;">JAN 28, 2026</span>
        <h4 class="font-serif">The Future of AI in KMC</h4>
        <p style="color: #64748b; font-size: 0.8rem;">How students of the Batch of 2030 are leading digital health...</p>
    </div>
    """, unsafe_allow_html=True)

# Founders Section
st.markdown('<div style="text-align: center; margin-top: 8rem; margin-bottom: 4rem;"><h2 class="font-serif" style="font-size: 4rem;">The Visionaries</h2></div>', unsafe_allow_html=True)
f_col1, f_col2 = st.columns(2)

with f_col1:
    st.markdown(f"""
    <div class="founder-card">
        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400" class="founder-img">
        <h2 class="font-serif" style="color: white;">Talha</h2>
        <p style="color: #e11d48; font-weight: 800; font-size: 0.7rem; text-transform: uppercase;">Founder & Medical Lead</p>
        <p style="color: #64748b; font-size: 0.8rem; font-style: italic;">Second-year medical student at KMC focusing on AI diagnostics.</p>
    </div>
    """, unsafe_allow_html=True)

with f_col2:
    st.markdown(f"""
    <div class="founder-card" style="border-color: rgba(99, 102, 241, 0.2);">
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" class="founder-img" style="border-color: #6366f1;">
        <h2 class="font-serif" style="color: white;">Vareesha</h2>
        <p style="color: #6366f1; font-weight: 800; font-size: 0.7rem; text-transform: uppercase;">Founder & Clinical Educator</p>
        <p style="color: #64748b; font-size: 0.8rem; font-style: italic;">Public health advocate and clinical reasoning specialist at KMC.</p>
    </div>
    """, unsafe_allow_html=True)

# Motto
st.markdown(f"""
<div class="motto-section">
    <h1 class="font-serif" style="font-size: 4rem; color: #0f172a;">"{MOTTO}"</h1>
</div>
""", unsafe_allow_html=True)

# Footer
st.markdown(f"""
<div style="background: #020617; padding: 5rem 2rem; color: white; text-align: center;">
    <p style="font-size: 0.7rem; color: #334155; max-width: 800px; margin: 0 auto;">{MANDATORY_DISCLAIMER}</p>
    <div style="margin-top: 3rem; font-weight: 800; letter-spacing: 0.5em; color: #1e293b;">© 2026 MED-SYMPTOM ASSISTANT</div>
</div>
""", unsafe_allow_html=True)

// Auto-generated wrapper to make content load file:// safe.
// Source: quests.json
export default 
{
  "app": {
    "id": "gopal",
    "storageVersion": 1
  },
  "presets": {
    "naamJap": [
      { "id": "hare_krishna", "label": {"en":"Hare Krishna","hi":"हरे कृष्ण"}, "text": {"en":"Hare Krishna","hi":"हरे कृष्ण"} },
      { "id": "radhe_radhe", "label": {"en":"Radhe Radhe","hi":"राधे राधे"}, "text": {"en":"Radhe Radhe","hi":"राधे राधे"} },
      { "id": "om_namo", "label": {"en":"Om Namo Bhagavate Vasudevaya","hi":"ॐ नमो भगवते वासुदेवाय"}, "text": {"en":"Om Namo Bhagavate Vasudevaya","hi":"ॐ नमो भगवते वासुदेवाय"} }
    ]
  },
  "tasks": [
    {
      "id": "pranam_parents",
      "category": "respect",
      "slots": ["morning"],
      "confirmKey": "pranam",
      "title": {"en":"Pranam to Parents","hi":"माता-पिता को प्रणाम"},
      "teachLine": {"en":"Respect is strength.","hi":"सम्मान ही शक्ति है।"},
      "play": {
        "mode": "tap_sequence",
        "config": {
          "steps": [
            {"en":"Fold hands","hi":"हाथ जोड़ो"},
            {"en":"Bow down","hi":"झुको"},
            {"en":"Touch feet","hi":"चरण स्पर्श"},
            {"en":"Stand and smile","hi":"खड़े होकर मुस्कुराओ"}
          ]
        }
      },
      "realWorld": {"en":"Now do pranam to your parents.","hi":"अब माता-पिता को प्रणाम करो।"},
      "reflection": {
        "prompt": {"en":"How did it feel?","hi":"कैसा लगा?"},
        "choices": [
          {"en":"Happy","hi":"अच्छा"},
          {"en":"Shy","hi":"शर्म आई"},
          {"en":"I will try again","hi":"फिर कोशिश"}
        ]
      },
      "reward": {"flowers": 1}
    },
    {
      "id": "naam_mala",
      "category": "naam",
      "slots": ["morning"],
      "title": {"en":"Naam Jap Mala","hi":"नाम जप माला"},
      "teachLine": {"en":"A calm mind is a brave mind.","hi":"शांत मन, साहसी मन।"},
      "play": {
        "mode": "tap_rhythm",
        "config": { "beads": [9,18,27] }
      },
      "realWorld": {"en":"Say the naam softly while tapping.","hi":"टैप करते हुए नाम धीरे बोलो।"},
      "reflection": {
        "prompt": {"en":"Your mind is...","hi":"मन कैसा है?"},
        "choices": [
          {"en":"Calm","hi":"शांत"},
          {"en":"Restless","hi":"चंचल"},
          {"en":"Sleepy","hi":"नींद सा"}
        ]
      },
      "reward": {"flowers": 1}
    },
    {
      "id": "samay_on_time",
      "category": "samay",
      "slots": ["afternoon"],
      "title": {"en":"Samay Rakshak","hi":"समय रक्षक"},
      "teachLine": {"en":"Time is treasure.","hi":"समय धन है।"},
      "play": {
        "mode": "schedule_blocks",
        "config": {
          "blocks": [
            {"id":"study","mins":20,"label":{"en":"Study","hi":"पढ़ाई"}},
            {"id":"play","mins":20,"label":{"en":"Play","hi":"खेल"}},
            {"id":"seva","mins":10,"label":{"en":"Help","hi":"सेवा"}}
          ]
        }
      },
      "realWorld": {"en":"Start the first block now.","hi":"पहला काम अभी शुरू करो।"},
      "reflection": {
        "prompt": {"en":"Starting on time is...","hi":"समय पर शुरू करना..."},
        "choices": [
          {"en":"Easy","hi":"आसान"},
          {"en":"Okay","hi":"ठीक"},
          {"en":"Hard","hi":"कठिन"}
        ]
      },
      "reward": {"flowers": 1}
    },
    {
      "id": "study_focus",
      "category": "study",
      "slots": ["afternoon"],
      "title": {"en":"Study Start Ritual","hi":"पढ़ाई शुरू रीत"},
      "teachLine": {"en":"Start small. Continue daily.","hi":"छोटा शुरू करो। रोज़ जारी रखो।"},
      "play": {
        "mode": "tap_sequence",
        "config": {
          "steps": [
            {"en":"Sit straight","hi":"सीधे बैठो"},
            {"en":"Clear the desk","hi":"टेबल साफ़ करो"},
            {"en":"Open the book","hi":"किताब खोलो"},
            {"en":"Write the date","hi":"तारीख लिखो"}
          ]
        }
      },
      "realWorld": {"en":"Study for 5 minutes now.","hi":"अब 5 मिनट पढ़ाई करो।"},
      "reflection": {
        "prompt": {"en":"I studied with...","hi":"मैंने पढ़ाई की..."},
        "choices": [
          {"en":"Focus","hi":"ध्यान से"},
          {"en":"Some focus","hi":"थोड़ा ध्यान"},
          {"en":"I will retry","hi":"फिर कोशिश"}
        ]
      },
      "reward": {"flowers": 1}
    },
    {
      "id": "sports_activity",
      "category": "sports",
      "slots": ["evening"],
      "title": {"en":"Sports With Krishna","hi":"कृष्ण के साथ खेल"},
      "teachLine": {"en":"Strong body, strong duty.","hi":"मज़बूत शरीर, मज़बूत धर्म।"},
      "play": {
        "mode": "sports_rhythm",
        "config": { "target": 20, "label": {"en":"Jumps","hi":"कूद"} }
      },
      "realWorld": {"en":"Do 2 minutes of activity.","hi":"2 मिनट गतिविधि करो।"},
      "reflection": {
        "prompt": {"en":"Your energy is...","hi":"ऊर्जा कैसी है?"},
        "choices": [
          {"en":"High","hi":"ज़्यादा"},
          {"en":"Medium","hi":"ठीक"},
          {"en":"Low","hi":"कम"}
        ]
      },
      "reward": {"flowers": 1}
    },
    {
      "id": "seva_help",
      "category": "seva",
      "slots": ["evening"],
      "confirmKey": "seva",
      "title": {"en":"Seva Card","hi":"सेवा कार्ड"},
      "teachLine": {"en":"Helping is worship.","hi":"सेवा ही पूजा है।"},
      "play": {
        "mode": "seva_cards",
        "config": {
          "cards": [
            {"id":"water","label":{"en":"Fill water bottle","hi":"पानी की बोतल भरो"}},
            {"id":"bed","label":{"en":"Make your bed","hi":"बिस्तर ठीक करो"}},
            {"id":"books","label":{"en":"Arrange books","hi":"किताबें सजाओ"}},
            {"id":"plates","label":{"en":"Help set plates","hi":"प्लेट लगाओ"}}
          ]
        }
      },
      "realWorld": {"en":"Do your seva now.","hi":"अपनी सेवा अब करो।"},
      "reflection": {
        "prompt": {"en":"Whom did you help?","hi":"किसकी मदद की?"},
        "choices": [
          {"en":"Mother","hi":"माँ"},
          {"en":"Father","hi":"पापा"},
          {"en":"Grandparent","hi":"दादा-दादी"}
        ]
      },
      "reward": {"flowers": 1}
    }
    ,
    {
      "id": "bonus_seva",
      "category": "seva",
      "slots": ["bonus"],
      "bonusOnly": true,
      "title": {"en":"Bonus Seva","hi":"बोनस सेवा"},
      "teachLine": {"en":"A little extra seva makes the heart bright.","hi":"थोड़ी अतिरिक्त सेवा से मन उजला होता है।"},
      "play": {
        "mode": "seva_cards",
        "config": {
          "cards": [
            {"id":"water","label":{"en":"Fill water bottle","hi":"पानी की बोतल भरो"}},
            {"id":"bed","label":{"en":"Make your bed","hi":"बिस्तर ठीक करो"}},
            {"id":"books","label":{"en":"Arrange books","hi":"किताबें सजाओ"}},
            {"id":"plates","label":{"en":"Help set plates","hi":"प्लेट लगाओ"}}
          ]
        }
      },
      "realWorld": {"en":"Do your bonus seva now.","hi":"अपनी बोनस सेवा अब करो।"},
      "reflection": {
        "prompt": {"en":"Which seva did you do?","hi":"कौन सी सेवा की?"},
        "choices": [
          {"en":"I did it","hi":"मैंने की"},
          {"en":"I will do now","hi":"अभी करूंगा/करूंगी"},
          {"en":"Later","hi":"बाद में"}
        ]
      },
      "reward": {"flowers": 0}
    }
  ]
}

;

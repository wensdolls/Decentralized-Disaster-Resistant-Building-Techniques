import { describe, it, expect, beforeEach } from "vitest"

// Mock implementation for testing Clarity contracts
const mockPrincipal = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
const mockBlockHeight = 100

// Mock state
let lastDesignId = 0
const designs = new Map()

// Mock contract functions
const registerDesign = (name, description, disasterTypes, resilienceFeatures, materialsRequired) => {
  const newId = lastDesignId + 1
  lastDesignId = newId
  
  designs.set(newId, {
    owner: mockPrincipal,
    name,
    description,
    "disaster-types": disasterTypes,
    "resilience-features": resilienceFeatures,
    "materials-required": materialsRequired,
    "creation-height": mockBlockHeight,
  })
  
  return { value: newId }
}

const updateDesign = (designId, name, description, disasterTypes, resilienceFeatures, materialsRequired) => {
  const design = designs.get(designId)
  if (!design) return { error: 404 }
  if (design.owner !== mockPrincipal) return { error: 403 }
  
  designs.set(designId, {
    ...design,
    name,
    description,
    "disaster-types": disasterTypes,
    "resilience-features": resilienceFeatures,
    "materials-required": materialsRequired,
  })
  
  return { value: designId }
}

const getDesign = (designId) => {
  const design = designs.get(designId)
  return design ? design : null
}

describe("Design Registration Contract", () => {
  beforeEach(() => {
    // Reset state before each test
    lastDesignId = 0
    designs.clear()
  })
  
  it("should register a new design", () => {
    const result = registerDesign(
        "Earthquake Resistant Home",
        "A residential design optimized for earthquake resistance",
        "Earthquake, Tremors",
        "Base isolation, Flexible connections, Reinforced structure",
        "Reinforced concrete, Steel frames, Flexible joints",
    )
    
    expect(result.value).toBe(1)
    expect(designs.size).toBe(1)
    
    const design = getDesign(1)
    expect(design).not.toBeNull()
    expect(design.name).toBe("Earthquake Resistant Home")
    expect(design["disaster-types"]).toBe("Earthquake, Tremors")
    expect(design["resilience-features"]).toBe("Base isolation, Flexible connections, Reinforced structure")
    expect(design["materials-required"]).toBe("Reinforced concrete, Steel frames, Flexible joints")
  })
  
  it("should update an existing design", () => {
    // First register a design
    registerDesign(
        "Earthquake Resistant Home",
        "A residential design optimized for earthquake resistance",
        "Earthquake, Tremors",
        "Base isolation, Flexible connections, Reinforced structure",
        "Reinforced concrete, Steel frames, Flexible joints",
    )
    
    // Then update it
    const updateResult = updateDesign(
        1,
        "Enhanced Earthquake Resistant Home",
        "An improved residential design optimized for earthquake resistance",
        "Earthquake, Tremors, Aftershocks",
        "Advanced base isolation, Flexible connections, Reinforced structure, Dampers",
        "High-grade reinforced concrete, Steel frames, Flexible joints, Shock absorbers",
    )
    
    expect(updateResult.value).toBe(1)
    
    const design = getDesign(1)
    expect(design.name).toBe("Enhanced Earthquake Resistant Home")
    expect(design.description).toBe("An improved residential design optimized for earthquake resistance")
    expect(design["disaster-types"]).toBe("Earthquake, Tremors, Aftershocks")
    expect(design["resilience-features"]).toBe(
        "Advanced base isolation, Flexible connections, Reinforced structure, Dampers",
    )
    expect(design["materials-required"]).toBe(
        "High-grade reinforced concrete, Steel frames, Flexible joints, Shock absorbers",
    )
  })
  
  it("should fail to update a non-existent design", () => {
    const updateResult = updateDesign(
        999,
        "Enhanced Earthquake Resistant Home",
        "An improved residential design optimized for earthquake resistance",
        "Earthquake, Tremors, Aftershocks",
        "Advanced base isolation, Flexible connections, Reinforced structure, Dampers",
        "High-grade reinforced concrete, Steel frames, Flexible joints, Shock absorbers",
    )
    
    expect(updateResult.error).toBe(404)
  })
  
  it("should fail to update a design if not the owner", () => {
    // First register a design
    registerDesign(
        "Earthquake Resistant Home",
        "A residential design optimized for earthquake resistance",
        "Earthquake, Tremors",
        "Base isolation, Flexible connections, Reinforced structure",
        "Reinforced concrete, Steel frames, Flexible joints",
    )
    
    // Modify the owner to simulate a different user
    const design = designs.get(1)
    designs.set(1, { ...design, owner: "ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM" })
    
    // Then try to update it
    const updateResult = updateDesign(
        1,
        "Enhanced Earthquake Resistant Home",
        "An improved residential design optimized for earthquake resistance",
        "Earthquake, Tremors, Aftershocks",
        "Advanced base isolation, Flexible connections, Reinforced structure, Dampers",
        "High-grade reinforced concrete, Steel frames, Flexible joints, Shock absorbers",
    )
    
    expect(updateResult.error).toBe(403)
  })
})


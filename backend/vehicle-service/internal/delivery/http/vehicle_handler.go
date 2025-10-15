package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"vehicle-service/internal/domain"

	"github.com/gorilla/mux"
)

type VehicleHandler struct {
	vehicleUseCase domain.VehicleUseCase
}

// NewVehicleHandler creates a new vehicle handler
func NewVehicleHandler(vehicleUseCase domain.VehicleUseCase) *VehicleHandler {
	return &VehicleHandler{
		vehicleUseCase: vehicleUseCase,
	}
}

// RegisterRoutes registers all vehicle routes
func (h *VehicleHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/health", h.HealthCheck).Methods("GET")
	router.HandleFunc("/vehicles", h.CreateVehicle).Methods("POST")
	router.HandleFunc("/vehicles", h.ListVehicles).Methods("GET")
	router.HandleFunc("/vehicles/available", h.GetAvailableVehicles).Methods("GET")
	router.HandleFunc("/vehicles/stats", h.GetVehicleStats).Methods("GET")
	router.HandleFunc("/vehicles/{id}", h.GetVehicle).Methods("GET")
	router.HandleFunc("/vehicles/{id}", h.UpdateVehicle).Methods("PUT")
	router.HandleFunc("/vehicles/{id}", h.DeleteVehicle).Methods("DELETE")
	router.HandleFunc("/vehicles/{id}/location", h.UpdateVehicleLocation).Methods("PUT")
	router.HandleFunc("/vehicles/{id}/status", h.UpdateVehicleStatus).Methods("PUT")
	router.HandleFunc("/vehicles/{id}/battery", h.UpdateVehicleBattery).Methods("PUT")
}

// HealthCheck returns the health status of the service
func (h *VehicleHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	response := map[string]interface{}{
		"status":    "healthy",
		"service":   "vehicle-service",
		"timestamp": fmt.Sprintf("%d", 1000),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// CreateVehicle creates a new vehicle
func (h *VehicleHandler) CreateVehicle(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateVehicleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	vehicle, err := h.vehicleUseCase.CreateVehicle(r.Context(), &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(vehicle)
}

// GetVehicle gets a vehicle by ID
func (h *VehicleHandler) GetVehicle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	vehicle, err := h.vehicleUseCase.GetVehicle(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(vehicle)
}

// UpdateVehicle updates a vehicle
func (h *VehicleHandler) UpdateVehicle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var req domain.UpdateVehicleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	vehicle, err := h.vehicleUseCase.UpdateVehicle(r.Context(), id, &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(vehicle)
}

// DeleteVehicle deletes a vehicle
func (h *VehicleHandler) DeleteVehicle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := h.vehicleUseCase.DeleteVehicle(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// ListVehicles lists vehicles with filtering
func (h *VehicleHandler) ListVehicles(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	filter := &domain.VehicleFilter{
		Limit:  10,
		Offset: 0,
	}

	if limit := query.Get("limit"); limit != "" {
		if l, err := strconv.Atoi(limit); err == nil {
			filter.Limit = l
		}
	}

	if offset := query.Get("offset"); offset != "" {
		if o, err := strconv.Atoi(offset); err == nil {
			filter.Offset = o
		}
	}

	if status := query.Get("status"); status != "" {
		vehicleStatus := domain.VehicleStatus(status)
		filter.Status = &vehicleStatus
	}

	if make := query.Get("make"); make != "" {
		filter.Make = &make
	}

	if model := query.Get("model"); model != "" {
		filter.Model = &model
	}

	if year := query.Get("year"); year != "" {
		if y, err := strconv.Atoi(year); err == nil {
			filter.Year = &y
		}
	}

	response, err := h.vehicleUseCase.ListVehicles(r.Context(), filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// UpdateVehicleLocation updates vehicle location
func (h *VehicleHandler) UpdateVehicleLocation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var location domain.Location
	if err := json.NewDecoder(r.Body).Decode(&location); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.vehicleUseCase.UpdateVehicleLocation(r.Context(), id, &location); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// UpdateVehicleStatus updates vehicle status
func (h *VehicleHandler) UpdateVehicleStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var req struct {
		Status domain.VehicleStatus `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.vehicleUseCase.UpdateVehicleStatus(r.Context(), id, req.Status); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// UpdateVehicleBattery updates vehicle battery level
func (h *VehicleHandler) UpdateVehicleBattery(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var req struct {
		BatteryLevel int `json:"battery_level"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.vehicleUseCase.UpdateVehicleBattery(r.Context(), id, req.BatteryLevel); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// GetAvailableVehicles gets available vehicles with filtering
func (h *VehicleHandler) GetAvailableVehicles(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	filter := &domain.AvailabilityFilter{
		Limit:  10,
		Offset: 0,
	}

	if limit := query.Get("limit"); limit != "" {
		if l, err := strconv.Atoi(limit); err == nil {
			filter.Limit = l
		}
	}

	if offset := query.Get("offset"); offset != "" {
		if o, err := strconv.Atoi(offset); err == nil {
			filter.Offset = o
		}
	}

	if lat := query.Get("latitude"); lat != "" {
		if lng := query.Get("longitude"); lng != "" {
			if latitude, err := strconv.ParseFloat(lat, 64); err == nil {
				if longitude, err := strconv.ParseFloat(lng, 64); err == nil {
					filter.Location = &domain.Location{
						Latitude:  latitude,
						Longitude: longitude,
					}
				}
			}
		}
	}

	if radius := query.Get("radius"); radius != "" {
		if r, err := strconv.ParseFloat(radius, 64); err == nil {
			filter.Radius = &r
		}
	}

	if minBattery := query.Get("min_battery"); minBattery != "" {
		if mb, err := strconv.Atoi(minBattery); err == nil {
			filter.MinBattery = &mb
		}
	}

	vehicles, err := h.vehicleUseCase.GetAvailableVehicles(r.Context(), filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(vehicles)
}

// GetVehicleStats handles GET /vehicles/stats
func (h *VehicleHandler) GetVehicleStats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.vehicleUseCase.GetStats(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

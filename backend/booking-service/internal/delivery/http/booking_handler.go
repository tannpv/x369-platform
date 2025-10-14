package http

import (
	"encoding/json"
	"net/http"
	"strconv"

	"booking-service/internal/domain"

	"github.com/gorilla/mux"
)

type BookingHandler struct {
	bookingUseCase domain.BookingUseCase
}

func NewBookingHandler(bookingUseCase domain.BookingUseCase) *BookingHandler {
	return &BookingHandler{
		bookingUseCase: bookingUseCase,
	}
}

func (h *BookingHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/bookings", h.CreateBooking).Methods("POST")
	router.HandleFunc("/bookings", h.ListBookings).Methods("GET")
	router.HandleFunc("/bookings/{id}", h.GetBooking).Methods("GET")
	router.HandleFunc("/bookings/{id}", h.UpdateBooking).Methods("PUT")
	router.HandleFunc("/bookings/{id}/cancel", h.CancelBooking).Methods("POST")
	router.HandleFunc("/bookings/{id}/start", h.StartBooking).Methods("POST")
	router.HandleFunc("/bookings/{id}/complete", h.CompleteBooking).Methods("POST")
	router.HandleFunc("/bookings/active", h.GetActiveBookings).Methods("GET")
	router.HandleFunc("/bookings/stats", h.GetBookingStats).Methods("GET")
	router.HandleFunc("/users/{userId}/bookings", h.GetUserBookings).Methods("GET")
	router.HandleFunc("/vehicles/{vehicleId}/bookings", h.GetVehicleBookings).Methods("GET")
}

func (h *BookingHandler) CreateBooking(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateBookingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	booking, err := h.bookingUseCase.CreateBooking(r.Context(), &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(booking)
}

func (h *BookingHandler) GetBooking(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	booking, err := h.bookingUseCase.GetBooking(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(booking)
}

func (h *BookingHandler) UpdateBooking(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var req domain.UpdateBookingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	booking, err := h.bookingUseCase.UpdateBooking(r.Context(), id, &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(booking)
}

func (h *BookingHandler) CancelBooking(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	userID := r.Header.Get("X-User-ID") // Get from auth header/middleware

	if userID == "" {
		http.Error(w, "User ID required", http.StatusUnauthorized)
		return
	}

	err := h.bookingUseCase.CancelBooking(r.Context(), id, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *BookingHandler) StartBooking(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	userID := r.Header.Get("X-User-ID") // Get from auth header/middleware

	if userID == "" {
		http.Error(w, "User ID required", http.StatusUnauthorized)
		return
	}

	err := h.bookingUseCase.StartBooking(r.Context(), id, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *BookingHandler) CompleteBooking(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	userID := r.Header.Get("X-User-ID") // Get from auth header/middleware

	if userID == "" {
		http.Error(w, "User ID required", http.StatusUnauthorized)
		return
	}

	var req domain.CompleteBookingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.bookingUseCase.CompleteBooking(r.Context(), id, userID, &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *BookingHandler) ListBookings(w http.ResponseWriter, r *http.Request) {
	filter := &domain.BookingFilter{}

	// Parse query parameters
	if userID := r.URL.Query().Get("user_id"); userID != "" {
		filter.UserID = &userID
	}
	if vehicleID := r.URL.Query().Get("vehicle_id"); vehicleID != "" {
		filter.VehicleID = &vehicleID
	}
	if status := r.URL.Query().Get("status"); status != "" {
		bookingStatus := domain.BookingStatus(status)
		filter.Status = &bookingStatus
	}

	if limit, err := strconv.Atoi(r.URL.Query().Get("limit")); err == nil {
		filter.Limit = limit
	} else {
		filter.Limit = 10
	}

	if offset, err := strconv.Atoi(r.URL.Query().Get("offset")); err == nil {
		filter.Offset = offset
	}

	response, err := h.bookingUseCase.ListBookings(r.Context(), filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *BookingHandler) GetUserBookings(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	limit := 10
	offset := 0

	if l, err := strconv.Atoi(r.URL.Query().Get("limit")); err == nil {
		limit = l
	}
	if o, err := strconv.Atoi(r.URL.Query().Get("offset")); err == nil {
		offset = o
	}

	bookings, err := h.bookingUseCase.GetUserBookings(r.Context(), userID, limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookings)
}

func (h *BookingHandler) GetVehicleBookings(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	vehicleID := vars["vehicleId"]

	limit := 10
	offset := 0

	if l, err := strconv.Atoi(r.URL.Query().Get("limit")); err == nil {
		limit = l
	}
	if o, err := strconv.Atoi(r.URL.Query().Get("offset")); err == nil {
		offset = o
	}

	bookings, err := h.bookingUseCase.GetVehicleBookings(r.Context(), vehicleID, limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookings)
}

func (h *BookingHandler) GetActiveBookings(w http.ResponseWriter, r *http.Request) {
	bookings, err := h.bookingUseCase.GetActiveBookings(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookings)
}

func (h *BookingHandler) GetBookingStats(w http.ResponseWriter, r *http.Request) {
	var userID *string
	if uid := r.URL.Query().Get("user_id"); uid != "" {
		userID = &uid
	}

	stats, err := h.bookingUseCase.GetBookingStats(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
